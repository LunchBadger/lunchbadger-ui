const serverHost = process.env.LBSERVER_HOST || 'localhost';

export default {
  expressGatewayAdminApiUrl: 'http://admin-{NAME}-{USER}-{ENV}.lunchbadger.io',
  customerUrl: 'http://workspace-{USER}-{ENV}.customer:3000',
  projectApiUrl: `http://${serverHost}:4230/api`,
  workspaceApiUrl: `http://${serverHost}:4231/api`,
  forecastApiUrl: `http://${serverHost}:4230/api`,
  configStoreApiUrl: `http://${serverHost}:3002/api`,
  gitBaseUrl: `http://${serverHost}:3002/git`,
  workspaceUrl: 'http://localhost:3000',
  user: {
    sub: 'demo',
    email: 'foo@lunchbadger.com',
    preferred_username: 'User Userman'
  },
  envId: 'dev'
};
