// Hack so that Mac OSX docker can sub in host.docker.internal instead of localhost
// see https://docs.docker.com/docker-for-mac/networking/#i-want-to-connect-from-a-container-to-a-service-on-the-host
const host =
  process.env.PLATFORM === 'linux' ? 'localhost' : 'host.docker.internal';

const APP_ID = 'automation-analytics';
const FRONTEND_PORT = 8002;
const routes = {};

routes[`/beta/apps/${APP_ID}`] = { host: `https://${host}:${FRONTEND_PORT}` };
routes[`/apps/${APP_ID}`] = { host: `https://${host}:${FRONTEND_PORT}` };
routes[`/ansible/insights`] = { host: `https://${host}:${FRONTEND_PORT}` };
routes[`/beta/ansible/insights`] = {
  host: `https://${host}:${FRONTEND_PORT}`,
};

module.exports = { routes };
