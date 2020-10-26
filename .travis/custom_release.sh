#!/usr/bin/env bash
set -e
set -x

# If current dev branch is devel, push to build repo ci-beta
if [ "${TRAVIS_BRANCH}" = "devel" ]; then
    .travis/release.sh "ci-beta"
fi

# If current dev branch is deployment branch, push to build repo
if [[ "${TRAVIS_BRANCH}" = "ci-stable"  || "${TRAVIS_BRANCH}" = "qa-beta" || "${TRAVIS_BRANCH}" = "qa-stable" || "${TRAVIS_BRANCH}" = "prod-beta" || "${TRAVIS_BRANCH}" = "prod-stable" || "${TRAVIS_BRANCH}" = "qaprodauth-stable" || "${TRAVIS_BRANCH}" = "qaprodauth-beta" ]]; then
    .travis/release.sh "${TRAVIS_BRANCH}"
fi
