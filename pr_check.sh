#!/bin/bash -x 

echo $(date -u) "*** To start PR check"
# --------------------------------------------
# Options that must be configured by app owner
# --------------------------------------------

APP_NAME="tower-analytics"  # name of app-sre "application" folder this component lives in
APP_NAME="$APP_NAME,gateway,insights-ephemeral"
COMPONENT_NAME="tower-analytics-clowdapp"  # name of app-sre "resourceTemplate" in deploy.yaml for this component
IMAGE="quay.io/cloudservices/automation-analytics-api"
IMAGE_TAG="qa"

IQE_PLUGINS="automation_analytics"
IQE_MARKER_EXPRESSION="ephemeral"
IQE_FILTER_EXPRESSION=""

# Install bonfire repo/initialize
CICD_URL=https://raw.githubusercontent.com/RedHatInsights/bonfire/master/cicd
curl -s $CICD_URL/bootstrap.sh > .cicd_bootstrap.sh && source .cicd_bootstrap.sh

# overriding IMAGE_TAG defined by boostrap.sh, for now
# export IMAGE_TAG="pr-$IMAGE_TAG"

export
env

export NAMESPACE=$(bonfire namespace reserve)
export IQE_IMAGE=quay.io/cloudservices/iqe-tests:automation-analytics

bonfire deploy \
    ${APP_NAME} \
    --no-remove-resources tower-analytics-clowdapp \
    --source appsre \
    --set-template-ref ${COMPONENT_NAME}=HEAD \
    --set-image-tag $IMAGE=$IMAGE_TAG \
    --namespace ${NAMESPACE}

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
