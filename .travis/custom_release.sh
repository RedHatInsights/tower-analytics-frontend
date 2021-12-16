#!/usr/bin/env bash
set -e
set -x

if [[ "${TRAVIS_PULL_REQUEST_BAK}" != "false" && "${PR_CHECK}" == "true" ]]; then
    # reset TRAVIS_PULL_REQUEST
    TRAVIS_PULL_REQUEST="${TRAVIS_PULL_REQUEST_BAK}"
    export TRAVIS_PULL_REQUEST
    .travis/release.sh "PR-${TRAVIS_PULL_REQUEST}"
    exit $?
fi

echo 'problem ****************************'
# If current dev branch is devel, push to build repo ci, qa, and prod-beta
# qa is stage, ci is probably not used anymore
# if [ "${TRAVIS_BRANCH}" = "devel" ]; then
#     .travis/release.sh "ci-beta"
#     rm -rf dist/.git
#     .travis/release.sh "ci-stable"
#     rm -rf dist/.git
#     .travis/release.sh "qa-beta"
#     rm -rf dist/.git
#     .travis/release.sh "qa-stable"
#     rm -rf dist/.git
#     .travis/release.sh "prod-beta"
#     rm -rf dist/.git
# fi

# # If current dev branch is deployment branch, push to build repo
# if [ "${TRAVIS_BRANCH}" = "prod-stable" ]; then
#     .travis/release.sh "${TRAVIS_BRANCH}"
# fi
