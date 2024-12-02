# Automation Analytics Front End

Automation Analytics provides data analytics for Ansible Tower that provides visualization and insight into how automation is used in your organization.

### Developing against a deployed backend

Have Node 20+ installed, have a custom `127.0.2.1 stage.foo.redhat.com` line in your `/etc/hosts`.

1. `npm install` - install dependencies
2. `npm run start` - start local frontend while proxying all the requests to the stage environment
3. open https://stage.foo.redhat.com:1337/ansible/automation-analytics/

You need valid credentials for the crc stage environment you are running against to be able to log in.

### Other

- `npm run lint` - runs eslint
- `npm run lint:fix` - runs eslint fix
- `npm run prettier` - runs prettier fix
