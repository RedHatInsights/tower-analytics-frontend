#!/bin/bash -x

CICD_URL=https://raw.githubusercontent.com/RedHatInsights/bonfire/master/cicd
curl -s $CICD_URL/bootstrap.sh > .cicd_bootstrap.sh && source .cicd_bootstrap.sh

npm ci

echo "======================== Start test virus signiture========================="
set +e
echo 'X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*' > clamav-testfile
docker run --rm -v $PWD/:/src -i quay.io/cloudservices/automation-analytics-clamscan-image:latest clamscan -v -i -r /src/clamav-testfile
rm -f clamav-testfile
echo "======================== End test virus signiture========================="

set -e
docker run --rm -v $PWD/:/src -i quay.io/cloudservices/automation-analytics-clamscan-image:latest clamscan -v -i -r /src
set +e

mkdir -p $WORKSPACE/artifacts
cat << EOF > ${WORKSPACE}/artifacts/junit-dummy.xml
<testsuite tests="1">
    <testcase classname="dummy" name="dummytest"/>
</testsuite>
EOF

exit 0

