#!/usr/bin/env bash

set -exv

# imports
export COMMON_BUILDER=https://raw.githubusercontent.com/RedHatInsights/insights-frontend-builder-common/master
export CICD_URL=https://raw.githubusercontent.com/RedHatInsights/bonfire/master/cicd

# common
export WORKSPACE=${WORKSPACE:-$APP_ROOT}
export APP_ROOT=$(pwd)
export NODE_BUILD_VERSION=16
export APP_NAME="tower-analytics"
export CLOWD_APP_NAME=automation-analytics
export BACKUP_APP_ROOT=${WORKSPACE:-$APP_ROOT}

# bonfire & build variables
export BONFIRE_APP_NAME="tower-analytics" 
export BONFIRE_COMPONENT_NAME="tower-analytics-clowdapp"
export BONFIRE_COMPONENTS_ARG=""

# backend
export COMPONENT_NAME="tower-analytics-clowdapp"
export IMAGE_BACKEND="quay.io/cloudservices/automation-analytics-api"
export IMAGE_BACKEND_TAG="qa"

# frontend
export IMAGE="quay.io/cloudservices/automation-analytics-frontend"
export IMAGE_FRONTEND="quay.io/cloudservices/automation-analytics-frontend"
export IMAGE_FRONTEND_TAG=$(git rev-parse --short=7 HEAD)
export IMAGE_FRONTEND_SHA1=$(git rev-parse HEAD)

# iqe
export IQE_PLUGINS="automation-analytics"
export IQE_IMAGE="quay.io/cloudservices/iqe-tests:automation-analytics"
export IQE_MARKER_EXPRESSION="smoke"
export IQE_FILTER_EXPRESSION=""
export IQE_CJI_TIMEOUT="15m"

# Review vars
export 
env

# Build uses: IMAGE, COMPONENT, WORKSPACE, APP_ROOT & NODE_BUILD_VERSION
set -exv
source <(curl -sSL $COMMON_BUILDER/src/frontend-build.sh)

# undo muddiness @blake
export APP_ROOT=$BACKUP_APP_ROOT

# Bonfire install and namespace reserve
cd $WORKSPACE
curl -s $CICD_URL/bootstrap.sh > .cicd_bootstrap.sh && source .cicd_bootstrap.sh
export NAMESPACE=$(bonfire namespace reserve)
oc project $NAMESPACE

# Bonfire deploy
set -exv
bonfire deploy \
    $BONFIRE_APP_NAME \
    --no-remove-resources $BONFIRE_COMPONENT_NAME \
    --source appsre \
    --set-template-ref $BONFIRE_COMPONENT_NAME=main \
	--set-template-ref tower-analytics-frontend=$IMAGE_FRONTEND_SHA1 \
    --set-image-tag $IMAGE_BACKEND=$IMAGE_BACKEND_TAG \
	--set-image-tag $IMAGE_FRONTEND=$IMAGE_FRONTEND_TAG \
    --frontends=true \
    --namespace $NAMESPACE \
    $BONFIRE_COMPONENTS_ARG

#	--set-template-ref tower-analytics-frontend=$IMAGE_FRONTEND_TAG 























oc exec  -n $NAMESPACE deployments/automation-analytics-api-fastapi-v2 -- bash -c "./entrypoint ./tower_analytics_report/management/commands/generate_development_data.py --tenant_id 12345"
oc exec  -n $NAMESPACE deployments/automation-analytics-api-fastapi-v2 -- bash -c "./entrypoint ./tower_analytics_report/management/commands/run_rollups_one_time.py"

echo $BONFIRE_NS_REQUESTER
export COMPONENT_NAME=automation-analytics
source ${CICD_ROOT}/cji_smoke_test.sh

# export UI_URL=`oc get route front-end-aggregator -o jsonpath='https://{.spec.host}{"\n"}' -n $NAMESPACE`
export ui_container=$(oc get route | grep chrome | tail -n 1 | awk '{print $1}')
export UI_URL=`oc get route $ui_container -o jsonpath='https://{.spec.host}' -n $NAMESPACE`
#export UI_PORT=`oc get route frontend-new -o jsonpath='{.spec.port.targetPort}' -n $NAMESPACE`
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

export CYPRESS_PW=$(oc get secret env-$NAMESPACE-keycloak -o json | jq -r '.data | map_values(@base64d) | .defaultPassword')

cat >/tmp/frontend/cypress_run.sh <<EOL
export CYPRESS_RECORD_KEY=${CYPRESS_RECORD_KEY}
export CYPRESS_ProjectID=wwyf7n
export CYPRESS_RECORD=true
export CYPRESS_USERNAME=jdoe
export CYPRESS_PASSWORD=${CYPRESS_PW}
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

sleep 900

mkdir -p $WORKSPACE/artifacts
cat << EOF > $WORKSPACE/artifacts/junit-dummy.xml
	<testsuite tests="1">
	<testcase classname="dummy" name="dummytest"/>
	</testsuite>
EOF

exit $BUILD_RESULTS