#!/bin/bash

set -o nounset
set -o errexit

readonly GENERATE_MANIFEST=".travis/generate_manifest.js"
readonly MANIFESTS_DIR='manifests'
readonly MANIFEST_FILE="${MANIFESTS_DIR}/frontend.txt"

mkdir -p "$(dirname "${MANIFEST_FILE}")"
"${GENERATE_MANIFEST}" "${MANIFEST_FILE}"
