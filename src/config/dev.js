// const serverHost = process.env.LBSERVER_HOST || 'localhost';

export default {
  projectApiUrl: 'http://internal-{USER}-{ENV}.lunchbadger.io/project-api/api',
  workspaceApiUrl: 'http://internal-{USER}-{ENV}.lunchbadger.io/workspace-api/api',
  forecastApiUrl: 'http://internal-{USER}-{ENV}.lunchbadger.io/project-api/api',
  configStoreApiUrl: 'http://api.lunchbadger.com/api',
  gitBaseUrl: 'http://api.lunchbadger.com/git',
  workspaceUrl: 'http://{USER}-{ENV}.lunchbadger.io',
  expressGatewayAdminApiUrl: 'http://admin-gateway-{USER}-{ENV}-{ID}.lunchbadger.io',
  customerUrl: 'http://workspace-{USER}-{ENV}.customer:3000',
  user: {
    sub: 'demo',
    email: 'foo@lunchbadger.com',
    preferred_username: 'User Userman'
  },
  envId: 'dev'
};
