#!/bin/bash

# --------------------------------------------
# Export vars for helper scripts to use
# --------------------------------------------
# name of app-sre "application" folder this component lives in; needs to match for quay
export COMPONENT="tower-analytics"
export APP_NAME=`node -e 'console.log(require("./package.json").insights.appname)'`  # `automation-analytics`
export IMAGE="quay.io/cloudservices/automation-analytics-frontend"
export APP_ROOT=$(pwd)
cat /etc/redhat-release
COMMON_BUILDER=https://raw.githubusercontent.com/RedHatInsights/insights-frontend-builder-common/master

set -exv

npm ci
npm run verify

# Generate nginx config based on app name in package.json
curl -sSL $COMMON_BUILDER/src/nginx_conf_gen.sh | bash -s

curl -sSL $COMMON_BUILDER/src/quay_push.sh | bash -s

