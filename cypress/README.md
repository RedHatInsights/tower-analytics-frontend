# Ansible Automation Analytics - Test Automation Coverage Procedure and Best Practices

To make sure we update UI and its integration tests in the same PR this folder will be maintained inside this repository.

## Before Merging Your PR

- Be aware of [dependencies](/RedHatInsights/tower-analytics-frontend/blob/devel/package.json) updates, we should test everything to make sure its changes doesn’t break the UI.
- Review if you have any hardcoded data, we have fixtures to deal with it [here](/RedHatInsights/tower-analytics-frontend/cypress/fixtures) depending on the environment.
- Ideally we shouldn't have tests exclusive for ephemeral environments, but, if necessary make sure the tests are updated on stage and ephemeral folders.
- Request review from relevant teammates.

## Testing Ansible Automation Analytics

### Deploy

#### Deploy backend and frontend locally

1. Follow the instructions to [deploy the backend](https://gitlab.cee.redhat.com/automation-analytics/automation-analytics-backend)
2. Follow the instructions to [deploy the frontend](/RedHatInsights/tower-analytics-frontend#readme)
3. Wait until you see a message similar to `webpack compiled successfully`.

#### Deploy frontend locally with a stage backend

1. Open a new terminal in the root folder of this repo.
2. Run `npm ci` - to install dependencies from the lockfile.
3. Then run `npm start --env=stage` - to start local frontend while proxying all the request to the stage environment.
4. The link the proxy outputs to the terminal is your local frontend deployment. You need valid stage credentials to be able to log in.
5. Wait until you see a message similar to `webpack compiled successfully`.

#### Set variables

You can either just expoort those values or add them to your `.bashrc` or `.zshrc` files.
_Currently the best and easiest way to set up cypress for different environments is exporting those values_
_In the future we would implement some .env file for each environment_

```bash
export CYPRESS_test_env=1
export CYPRESS_USERNAME="jdoe"
export CYPRESS_PASSWORD="password"
export CYPRESS_baseUrl=https://stage.foo.redhat.com:1337/ansible/automation-analytics
```

test_env possible values:

<!-- do we really need/want to run locally? -->

- LOCAL: 0,
- EPHEMERAL: 1,
- STAGE: 2

#### Run the tests

1. Open a new terminal in the root folder of this repo.
2. Run one of the cypress commands:
   - `npm run integration` - to open cypress GUI where you can select and see the tests running.
   - `TBD` - to run tests for stage env.
   - `TBD` - to run tests for ephemeral env.
   - `TBD` - to run a specific set of tests, e.g. `npm run TBD /**`
