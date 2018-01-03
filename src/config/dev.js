const env = process.env.LB_ENV || 'staging'; // localhost|staging|triton

const isPrefix = env !== 'localhost';
const prefix = isPrefix ? `${env}-` : '';
const subdomain = isPrefix ? `${env}.` : '';

export default {
  configStoreApiUrl: `http://${prefix}api.lunchbadger.com/api`,
  gitBaseUrl: `http://${prefix}api.lunchbadger.com/git`,
  projectApiUrl: `http://internal-{USER}-{ENV}.${subdomain}lunchbadger.io/project-api/api`,
  workspaceApiUrl: `http://internal-{USER}-{ENV}.${subdomain}lunchbadger.io/workspace-api/api`,
  forecastApiUrl: `http://internal-{USER}-{ENV}.${subdomain}lunchbadger.io/project-api/api`,
  workspaceUrl: `http://{USER}-{ENV}.${subdomain}lunchbadger.io`,
  expressGatewayAdminApiUrl: 'http://admin-{NAME}-{USER}-{ENV}.lunchbadger.io',
  customerUrl: 'http://workspace-{USER}-{ENV}.customer:3000',
  kubeWatcherApiUrl: `http://kube-watcher.${prefix}api.lunchbadger.com`,
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
