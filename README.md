[![Build Status](https://travis-ci.org/RedHatInsights/tower-analytics-frontend.svg?branch=devel)](https://travis-ci.org/RedHatInsights/tower-analytics-frontend)

# Automation Analytics Front End

Automation Analytics provides data analytics for Ansible Tower that provides visualization and insight into how automation is used in your organization.

## Build Automation Analytics Front End

### Developing locally

1. `npm ci` - install dependencies from the lockfile
2. get the backend running: [automation analytics backend](https://gitlab.cee.redhat.com/automation-analytics/automation-analytics-backend)
3. `npm start` - starts standalone: webpack serves the files alongside with insights, rbac and keycloak.
4. Go to `http://localhost:1337/beta/ansible/insights` and use the admin/admin credentials to login.

#### Developing against a deployed backend

1. `npm ci` - install dependencies from the lockfile
2. `npm start --env=stage` - starts local frontend while proxying all the request to the stage environment.
3. Follow the link the proxy outputs to the terminal - this is different from env to env. You need valid credentials for the environment you are running against to be able to log in

#### Developing against a backend on the ephemeral

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
