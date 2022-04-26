const APP_ID = 'automation-analytics';
const FRONTEND_PORT = 8002;
const routes = {};

routes[`/beta/apps/${APP_ID}`] = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/apps/${APP_ID}`] = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/ansible/automation-analytics`] = {
  host: `https://localhost:${FRONTEND_PORT}`,
};
routes[`/beta/ansible/automation-analytics`] = {
  host: `https://localhost:${FRONTEND_PORT}`,
};

module.exports = { routes };
