#!/usr/bin/env bash

echo "PR: ${TRAVIS_PULL_REQUEST}"
echo "PR_BRANCH: BRANCH=${BRANCH}, TRAVIS_PULL_REQUEST_BRANCH=${TRAVIS_PULL_REQUEST_BRANCH}, TRAVIS_BRANCH=${TRAVIS_BRANCH}"

if [ "${TRAVIS_PULL_REQUEST}" != "false" ]; then
  # if this is a PR build, backup TRAVIS_PULL_REQUEST and set it to false
  # will be reset at end of custom_release.sh
  TRAVIS_PULL_REQUEST_BAK="${TRAVIS_PULL_REQUEST}"
  export TRAVIS_PULL_REQUEST_BAK
  export TRAVIS_PULL_REQUEST=false
  echo "Backup to TRAVIS_PULL_REQUEST_BAK: ${TRAVIS_PULL_REQUEST_BAK}"
fi
npm run deploy-only && curl -sSL https://raw.githubusercontent.com/RedHatInsights/insights-frontend-builder-common/master/src/bootstrap.sh | bash -s