#!/usr/bin/env bash

echo "PR: ${TRAVIS_PULL_REQUEST}"
echo "PR_CHECK: ${PR_CHECK}"
echo "PR_BRANCH: BRANCH=${BRANCH}, TRAVIS_PULL_REQUEST_BRANCH=${TRAVIS_PULL_REQUEST_BRANCH}, TRAVIS_BRANCH=${TRAVIS_BRANCH}"
TRAVIS_PULL_REQUEST_BAK="${TRAVIS_PULL_REQUEST}"
export TRAVIS_PULL_REQUEST_BAK
export TRAVIS_PULL_REQUEST=false
echo "Backup to TRAVIS_PULL_REQUEST_BAK: ${TRAVIS_PULL_REQUEST_BAK}"

npm run deploy-only
curl -sSL https://raw.githubusercontent.com/RedHatInsights/insights-frontend-builder-common/master/src/bootstrap.sh > bootstrap.sh
chmod +x bootstrap.sh
bash bootstrap.sh
