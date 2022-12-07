[![Build Status](https://travis-ci.org/RedHatInsights/tower-analytics-frontend.svg?branch=devel)](https://travis-ci.org/RedHatInsights/tower-analytics-frontend)

# Automation Analytics Front End

Automation Analytics provides data analytics for Ansible Tower that provides visualization and insight into how automation is used in your organization.

## Build Automation Analytics Front End

### Developing locally

1. `npm ci` - install dependencies from the lockfile
2. get the backend running: [automation analytics backend](https://gitlab.cee.redhat.com/automation-analytics/automation-analytics-backend)
3. `npm start` - starts standalone: webpack serves the files alongside with insights, rbac and keycloak.
4. Go to `http://localhost:1337/beta/ansible/automation-analytics` and use the admin/admin credentials to login.

When you have M1 Mac:
- `npm ci` - install dependencies from the lockfile
- get the backend running: [automation analytics backend](https://gitlab.cee.redhat.com/automation-analytics/automation-analytics-backend)
- build keycloak locally 
```
VERSION=16.1.1
git clone git@github.com:keycloak/keycloak-containers.git
cd keycloak-containers/server
git checkout $VERSION
docker build -t "jboss/keycloak:MAGIC" .
```
- run keycloak locally 
```
docker run -p 4001:8080 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin -e DB_VENDOR=h2 -v `pwd`/node_modules/@redhat-cloud-services/frontend-components-config-utilities/standalone/services/default/keycloak/realm_export.json:/tmp/realm_export.json jboss/keycloak:MAGIC -Dkeycloak.migration.action=import -Dkeycloak.migration.provider=singleFile -Dkeycloak.migration.file=/tmp/realm_export.json -Dkeycloak.migration.strategy=OVERWRITE_EXISTING
```
- in `node_modules/@redhat-cloud-services/frontend-components-config-utilities/standalone/services/rbac.js` change `redis:5.0.4` to `redis:latest`
- in `node_modules/@redhat-cloud-services/frontend-components-config-utilities/standalone/services/default/chrome.js` change whole `args` for keycloak to `node` (must be a container that will build and run without errors and not consume port 4001)
- `npm run start`
- Go to `http://localhost:1337/beta/ansible/automation-analytics` and use the admin/admin credentials to login.

Note that after running `npm install` or `npm ci` changes in `node_modules` will be lost. You can use this script to do it
```
sed -i.bak -e 's/redis:5.0.4/redis:latest/' node_modules/@redhat-cloud-services/frontend-components-config-utilities/standalone/services/rbac.js
sed -i.bak -e '/-p.*keycloakPort.*8080/d' -e '/"-[eD]/d' -e '/-v /d' -e 's/jboss\/keycloak/node/' node_modules/@redhat-cloud-services/frontend-components-config-utilities/standalone/services/default/chrome.js
```

#### Developing against a deployed backend

1. `npm ci` - install dependencies from the lockfile
2. `npm start --env=stage` - starts local frontend while proxying all the request to the stage environment.
3. Follow the link the proxy outputs to the terminal - this is different from env to env. You need valid credentials for the environment you are running against to be able to log in

#### WIP: Developing against a backend on the ephemeral (ephemeral is not supporting it yet)

1. `npm ci` - install dependencies from the lockfile
2. `npm start --env=eph --eph_id=YOUR_EPH_ID` - starts local frontend while proxying all the request to the eph environment.
3. Follow the link the proxy outputs to the terminal - this is different from env to env. You need valid credentials for the environment you are running against to be able to log in

### Testing

- `npm run lint` - runs eslint
- `npm run test` - runs jest
- `npm run test:watch` - runs jest in watch mode
- `npm run verify` - will run linters and tests

## Deploying

- The Platform team is using Travis to deploy the application
  - The Platform team will help you set up the Travis instance if this is the route you are wanting to take

### How it works

- any push to the `devel` branch will deploy to `stage`, `stage/beta`, `prod/beta`
- any push to the `prod-stable` branch will deploy to `prod`
- If a PR is accepted and merged, `devel` will be rebuilt and will deploy to `stage`, `stage/beta`, `prod/beta`
