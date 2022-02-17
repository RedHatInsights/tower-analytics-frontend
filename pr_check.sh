#!/usr/bin/env bash

set -e
set -x

# ----------------------------
# Check for PR branch function
# ----------------------------

SHORT_COMMIT=$(echo $ghprbActualCommit |cut -c1-7)
FRONTEND_BUILD_URL="https://github.com/RedHatInsights/tower-analytics-frontend-build/tree"

function check_pr_branch {    
    RET=$(curl -s -I $FRONTEND_BUILD_URL/pr-$1 | head -n 1 | awk '{print $2}' | tr -d '\n')

    if [[ $RET == "200" ]]; then
        return 0
    fi

    return 1
}

# -----
# Start
# -----

echo $(date -u) "*** To start PR check"
echo "Building $GIT_BRANCH $ghprbActualCommit $SHORT_COMMIT"

# --------------------------------------------
# Options that must be configured by app owner
# --------------------------------------------

APP_NAME="tower-analytics"  # name of app-sre "application" folder this component lives in
APP_NAME="$APP_NAME,gateway,insights-ephemeral"
COMPONENT_NAME="tower-analytics-clowdapp"  # name of app-sre "resourceTemplate" in deploy.yaml for this component
IMAGE="quay.io/cloudservices/automation-analytics-api"
AA_IMAGE_TAG="qa"

# ------------------------------------
# Wait for frontend pr-check to appear
# ------------------------------------

GO=1
WAIT_TIME=1200

while [[ $WAIT_TIME -gt 0 ]]; do 
    echo "Checking if pr-$SHORT_COMMIT is available"
    check_pr_branch $SHORT_COMMIT
    if [[ $? -eq 0 ]]; then
        echo "Branch pr-$SHORT_COMMIT is available, continuing..."
        GO=0
        break
    fi
    sleep 30
    WAIT_TIME=$(($WAIT_TIME - 30))
done

if [[ $GO -eq 1 ]]; then
    echo "Branch pr-$SHORT_COMMIT never appeared.  Check the jenkins job on github. exiting..."
    exit 1
fi

# ------------------------------------------------
# If the PR branch appears then deploy the backend
# ------------------------------------------------

# Install bonfire repo/initialize
CICD_URL=https://raw.githubusercontent.com/RedHatInsights/bonfire/master/cicd
curl -s $CICD_URL/bootstrap.sh > .cicd_bootstrap.sh && source .cicd_bootstrap.sh

export NAMESPACE=$(bonfire namespace reserve)
export IQE_IMAGE="quay.io/cloudservices/iqe-tests:automation-analytics"
oc project ${NAMESPACE}

bonfire deploy \
    ${APP_NAME} \
    --no-remove-resources $COMPONENT_NAME \
    --source appsre \
    --set-template-ref ${COMPONENT_NAME}=main \
    --set-image-tag $IMAGE=$AA_IMAGE_TAG \
    --namespace ${NAMESPACE} \
    ${COMPONENTS_ARG}

# ----------------------------------------------
# Update frotnend aggreagtor to us the pr branch
# ----------------------------------------------

rm -rf /tmp/frontend-build
git clone --depth 1 --branch pr-$SHORT_COMMIT https://github.com/RedHatInsights/tower-analytics-frontend-build.git /tmp/frontend-build
cd /tmp/frontend-build
BUILD_COMMIT_ID=$(git log -n 1 --pretty=format:"%H" | tr -d '\n')

cat >/tmp/app-config.yml <<EOL
---
automation-analytics:
    commit: $BUILD_COMMIT_ID
EOL

kubectl delete configmap aggregator-app-config
kubectl create configmap aggregator-app-config --from-file=/tmp/app-config.yml
kubectl rollout restart deployment/front-end-aggregator
kubectl rollout status deployment/front-end-aggregator

sleep 60
oc exec -n ${NAMESPACE} deployment/front-end-aggregator -- /www/src/do_platform_apps.py

while [ $? -ne 0 ]; do
    sleep 30
    oc exec -n ${NAMESPACE} deployment/front-end-aggregator -- /www/src/do_platform_apps.py
done

# -------------
# Fix SSO proxy
# -------------

FRONTEND_POD=`oc get pods | grep -i front | awk '{print $1}'`
UI_URL=`oc get route front-end-aggregator -o jsonpath='https://{.spec.host}{"\n"}' -n $NAMESPACE`
KEYCLOCK_URL=`oc get route keycloak -o jsonpath='https://{.spec.host}{"\n"}' -n $NAMESPACE`

KEYCLOCK_URL_CLEAN=$(echo $KEYCLOCK_URL |sed 's/https\?:\/\///')

mkdir -vp /tmp/fixsso
cat >/tmp/fixsso/fix_sso_url.sh <<EOL
#!/bin/bash -x

cd /all/code/chrome/js

for f in \`ls *.js\`; do 
	sed -i s/sso.qa.redhat.com/$KEYCLOCK_URL_CLEAN/g \$f 
	rm \$f.gz 
	gzip --keep \$f; 
done
EOL

chmod +x /tmp/fixsso/fix_sso_url.sh
oc rsync /tmp/fixsso $FRONTEND_POD:/tmp/

oc exec -n ${NAMESPACE} deployment/front-end-aggregator -- /tmp/fixsso/fix_sso_url.sh


# ------------------
# Generate test data
# ------------------

echo $(date -u) "*** To start generating testing data"
oc get deployments -n $NAMESPACE
oc exec  -n $NAMESPACE deployments/automation-analytics-api-fastapi-v2 -- bash -c "./entrypoint ./tower_analytics_report/management/commands/generate_development_data.py --tenant_id 3340852"
oc exec  -n $NAMESPACE deployments/automation-analytics-api-fastapi-v2 -- bash -c "./entrypoint ./tower_analytics_report/management/commands/process_rollups_one_time.py"


# ---------------
# Run smoke tests
# ---------------

export IQE_PLUGINS="automation_analytics"
export IQE_FILTER_EXPRESSION=""
export IQE_CJI_TIMEOUT="15m"
export CLOWD_APP_NAME=automation-analytics
export COMPONENT_NAME=automation-analytics

echo $SEP
echo "Create IQE Pod"
echo $SEP

echo $BONFIRE_NS_REQUESTER
source ${CICD_ROOT}/cji_smoke_test.sh


# -------
# Cypress
# -------

set +e

export UI_URL=`oc get route front-end-aggregator -o jsonpath='https://{.spec.host}{"\n"}' -n $NAMESPACE`
export IQE_IMAGE="quay.io/cloudservices/automation-analytics-cypress-image:latest"
export CYPRESS_RECORD_KEY=cfd2f4fd-402d-4da1-a3ad-f5f8e688fff2
export IQE_SERVICE_ACCOUNT=$(oc get serviceaccount | grep iqe | awk '{print $1}')

(
cat <<EOF
{
	"apiVersion": "v1", 
	"kind": "Pod", 
	"metadata": {
		"name": "cypress"
	}, 
	"spec": {
		"serviceAccountName": "$IQE_SERVICE_ACCOUNT",
		"containers": [{
			"command": ["/bin/cat"],
			"image": "quay.io/cloudservices/automation-analytics-cypress-image:latest", 
			"imagePullPolicy": "Always",
			"name": "cypress",
			"resources": {
				"limits": {
					"cpu": "1",
					"memory": "2Gi"
				},
				"requests": {
					"cpu": "500m",
					"memory": "1Gi"
                }
			},
			"stdin": true,
			"tty": true
		}], 
		"imagePullSecrets": [{
			"name": "quay-cloudservices-pull"
		}],
		"restartPolicy": "Never"
	}
}
EOF
) | oc apply -f - -n $NAMESPACE

RUNNING=$(oc get pod cypress | tail -n 1 | awk '{print $3}')
while [ "$RUNNING" != "Running" ]; do
    echo "Waiting for cypress pod.."
    sleep 10
    RUNNING=$(oc get pod cypress | tail -n 1 | awk '{print $3}')
done

oc create route edge unleash --service=env-${NAMESPACE}-featureflags --port=featureflags

rm -rf /tmp/frontend
git clone --depth 1 --branch devel https://github.com/RedHatInsights/tower-analytics-frontend.git /tmp/frontend
cd /tmp/frontend
git fetch origin pull/$ghprbPullId/head:pr-$ghprbPullId
git checkout pr-$ghprbPullId

cat >/tmp/frontend/cypress_run.sh <<EOL
export CYPRESS_RECORD_KEY=${CYPRESS_RECORD_KEY}
export CYPRESS_ProjectID=wwyf7n
export CYPRESS_RECORD=true
export CYPRESS_USERNAME=jdoe
export CYPRESS_PASSWORD=redhat
export CYPRESS_defaultCommandTimeout=10000
export CYPRESS_baseUrl=$UI_URL/beta/ansible/insights

cd /tmp/frontend
npm ci

#echo ">>> Cypress Electron"
#/src/node_modules/cypress/bin/cypress run integration --record --key ${CYPRESS_RECORD_KEY} --headless

echo ">>> Cypress Chrome"
/src/node_modules/cypress/bin/cypress run integration --record --key ${CYPRESS_RECORD_KEY} --browser chrome --headless

echo ">>> Cypress Firefox"
/src/node_modules/cypress/bin/cypress run integration --record --key ${CYPRESS_RECORD_KEY} --browser /opt/firefox/firefox-bin --headless
EOL

chmod +x /tmp/frontend/cypress_run.sh
oc rsync /tmp/frontend cypress:/tmp/

oc exec -n ${NAMESPACE} cypress -- bash -c "/tmp/frontend/cypress_run.sh"

set -e

# Stubbed out for now, will be added as tests are enabled
mkdir -p $WORKSPACE/artifacts
cat << EOF > $WORKSPACE/artifacts/junit-dummy.xml
<testsuite tests="1">
    <testcase classname="dummy" name="dummytest"/>
</testsuite>
EOF
