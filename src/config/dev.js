export default {
  configStoreApiUrl: 'http://api.lunchbadger.com/api',
  gitBaseUrl: 'http://api.lunchbadger.com/git',
  projectApiUrl: 'http://internal-{USER}-{ENV}.lunchbadger.io/project-api/api',
  workspaceApiUrl: 'http://internal-{USER}-{ENV}.lunchbadger.io/workspace-api/api',
  forecastApiUrl: 'http://internal-{USER}-{ENV}.lunchbadger.io/project-api/api',
  workspaceUrl: 'http://{USER}-{ENV}.lunchbadger.io',
  expressGatewayAdminApiUrl: 'http://admin-{NAME}-{USER}-{ENV}.lunchbadger.io',
  customerUrl: 'http://workspace-{USER}-{ENV}.customer:3000',
  kubeWatcherApiUrl: 'http://kube-watcher.lunchbadger.io',
  user: {
    sub: 'demo',
    email: 'foo@lunchbadger.com',
    preferred_username: 'User Userman'
  },
  envId: 'dev',
  features: {
    tritonLogo: true,
    tritonObjectStorage: true,
    microservices: true,
    apis: true,
    portals: true,
    metrics: true,
    forecasts: true
  }
};
