#!/usr/bin/env bash
set -e
set -x

if [ "${TRAVIS_PULL_REQUEST_BAK}" != "false" ]; then
    # This is a PR build.
    # reset TRAVIS_PULL_REQUEST
    git log -n 3
    echo `git log -n 3`
    echo `git rev-parse --verify HEAD`
    TRAVIS_PULL_REQUEST="${TRAVIS_PULL_REQUEST_BAK}"
    SHORT_COMMIT=$(echo $TRAVIS_PULL_REQUEST_SHA |cut -c1-7)
    export TRAVIS_PULL_REQUEST
    export TRAVIS_BRANCH_BAK="${TRAVIS_BRANCH}"
    export TRAVIS_BRANCH="${TRAVIS_PULL_REQUEST_BRANCH}"
    .travis/release.sh "pr-${SHORT_COMMIT}"

    export TRAVIS_BRANCH="${TRAVIS_BRANCH_BAK}"
    echo "reset TRAVIS_BRANCH=${TRAVIS_BRANCH}"
    exit $?
fi

# If current dev branch is devel, push to build repo ci, qa, and prod-beta
# qa is stage, ci is probably not used anymore
if [ "${TRAVIS_BRANCH}" = "devel" ]; then
    .travis/release.sh "ci-beta"
    rm -rf dist/.git
    .travis/release.sh "ci-stable"
    rm -rf dist/.git
    .travis/release.sh "qa-beta"
    rm -rf dist/.git
    .travis/release.sh "qa-stable"
    rm -rf dist/.git
    .travis/release.sh "prod-beta"
    rm -rf dist/.git
fi

# If current dev branch is deployment branch, push to build repo
if [ "${TRAVIS_BRANCH}" = "prod-stable" ]; then
    .travis/release.sh "${TRAVIS_BRANCH}"
fi