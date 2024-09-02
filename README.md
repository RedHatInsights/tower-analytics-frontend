# Automation Analytics Front End

Automation Analytics provides data analytics for Ansible Tower that provides visualization and insight into how automation is used in your organization.

### Developing against a deployed backend

1. `npm ci` - install dependencies from the lockfile
2. `npm run start` - starts local frontend while proxying all the request to the stage environment.
3. Follow the link the proxy outputs to the terminal - this is different from env to env. You need valid credentials for the environment you are running against to be able to log in

### Testing

- `npm run lint` - runs eslint
- `npm run test` - runs jest
- `npm run test:watch` - runs jest in watch mode
- `npm run verify` - will run linters and tests
