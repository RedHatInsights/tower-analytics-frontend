[![Build Status](https://travis-ci.org/RedHatInsights/tower-analytics-frontend.svg?branch=devel)](https://travis-ci.org/RedHatInsights/tower-analytics-frontend)

# Automation Analytics Front End

Automation Analytics provides data analytics for Ansible Tower that provides visualization and insight into how automation is used in your organization.

## Build Automation Analytics Front End

### Developing locally

Have [insights-proxy](https://github.com/RedHatInsights/insights-proxy) installed in a sibling folder to this folder.
1. `npm ci` - install dependencies from the lockfile
2. `npm run proxy:local`
3. `npm run start:beta` - starts webpack bundler and serves the files with webpack dev server

### Developing locally fullstack

The same as previous, but you need to run the backend as well.
- Then change the `npm run proxy:local` to `npm run proxy:fullstack`

### Testing

- `npm run lint` - runs eslint
- `npm run test` - runs jest
- `npm run test:watch` - runs jest in watch mode
- `npm run verify` will run linters and tests

## Deploying

- The Platform team is using Travis to deploy the application
  - The Platform team will help you set up the Travis instance if this is the route you are wanting to take

### How it works

- any push to the `devel` branch will deploy to `stage`, `stage/beta`, `prod/beta`
- any push to the `prod-stable` branch will deploy to `prod`
- If a PR is accepted and merged, `devel` will be rebuilt and will deploy to `stage`, `stage/beta`, `prod/beta`
