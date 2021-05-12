const APP_ID = 'automation-analytics';
const FRONTEND_PORT = 8002;
const API_PORT = 8004;
const routes = {};

routes[`/beta/apps/${APP_ID}`] = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/apps/${APP_ID}`] = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/ansible/insights`] = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/beta/ansible/insights`] = {
  host: `https://localhost:${FRONTEND_PORT}`,
};
routes[`/beta/config/main.yml`] = { host: `http://localhost:8889` };
routes[`/api/tower-analytics`] = { host: `http://localhost:${API_PORT}` };

module.exports = { routes };
