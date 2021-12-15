#!/bin/bash

echo $(date -u) "*** To start PR check"
# --------------------------------------------
# Export vars for helper scripts to use
# --------------------------------------------
# name of app-sre "application" folder this component lives in; needs to match for the push to quay.
COMPONENT_NAME="tower-analytics-clowdapp"  # name of app-sre "resourceTemplate" in deploy.yaml for this component
APP_NAME=`node -e 'console.log(require("./package.json").insights.appname)'`  # name of app-sre "application" folder this component lives in
APP_NAME="$APP_NAME,gateway,insights-ephemeral"

IMAGE="quay.io/cloudservices/automation-analytics-frontend"
cat /etc/redhat-release
COMMON_BUILDER=https://raw.githubusercontent.com/RedHatInsights/insights-frontend-builder-common/master

# --------------------------------------------
# Options that must be configured by app owner
# --------------------------------------------
IQE_PLUGINS="automation-analytics"
IQE_MARKER_EXPRESSION="smoke"
IQE_FILTER_EXPRESSION=""

set -ex

# Install bonfire repo/initialize
CICD_URL=https://raw.githubusercontent.com/RedHatInsights/bonfire/master/cicd
curl -s $CICD_URL/bootstrap.sh > .cicd_bootstrap.sh && source .cicd_bootstrap.sh

echo $(date -u) "*** To start deployment"
source ${CICD_ROOT}/_common_deploy_logic.sh
export NAMESPACE=$(bonfire namespace reserve)
export IQE_IMAGE=quay.io/cloudservices/iqe-tests:automation-analytics

bonfire deploy \
    ${APP_NAME} \
    --no-remove-resources tower-analytics-clowdapp \
    --source appsre \
    --set-template-ref ${COMPONENT_NAME}=${GIT_COMMIT} \
    --set-image-tag $IMAGE=$IMAGE_TAG \
    --namespace ${NAMESPACE} \
    ${COMPONENTS_ARG}


echo $(date -u) "*** To start generating testing data"
### Populate test data
oc get deployments -n $NAMESPACE
# oc exec  -n $NAMESPACE deployments/automation-analytics-api-fastapi-v2 -- bash -c "./entrypoint ./tower_analytics_report/management/commands/run_report_migrations.py"
oc exec  -n $NAMESPACE deployments/automation-analytics-api-fastapi-v2 -- bash -c "./entrypoint ./tower_analytics_report/management/commands/generate_development_data.py --tenant_id 3340852"
oc exec  -n $NAMESPACE deployments/automation-analytics-api-fastapi-v2 -- bash -c "./entrypoint ./tower_analytics_report/management/commands/process_rollups_one_time.py"
# oc exec  -n $NAMESPACE deployments/automation-analytics-api-fastapi-v2 -- bash -c "./entrypoint ./tower_analytics_report/management/commands/tenants_metrics.py"

echo $(date -u) "*** To start smoke test"
source $CICD_ROOT/smoke_test.sh

curl -sSL https://gitlab.cee.redhat.com/automation-analytics/automation-analytics-backend/-/raw/main/cypress.sh  | bash -s || true

# ---------------------------
# Build and Publish to Quay
# ---------------------------

npm ci
npm run verify

# Generate nginx config based on app name in package.json
curl -sSL $COMMON_BUILDER/src/nginx_conf_gen.sh | bash -s

# Set pr check images to expire so they don't clog the repo
echo "LABEL quay.expires-after=3d" >> $APP_ROOT/Dockerfile # tag expires in 3 days
curl -sSL $COMMON_BUILDER/src/quay_push.sh | bash -s

# Stubbed out for now, will be added as tests are enabled
mkdir -p $WORKSPACE/artifacts
cat << EOF > $WORKSPACE/artifacts/junit-dummy.xml
<testsuite tests="1">
    <testcase classname="dummy" name="dummytest"/>
</testsuite>
EOF
