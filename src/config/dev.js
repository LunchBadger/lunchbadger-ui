const env = process.env.LB_ENV || 'staging'; // staging|triton|gila|localhost

const tritonLogo = ['triton', 'gila'].includes(env);
const isPrefix = env !== 'localhost';
const isStaging = ['staging', 'localhost'].includes(env);
const prefix = isPrefix ? `${env}-` : '';
const subdomain = isPrefix ? `${env}.` : '';
const logins = ({
  gila: {
    minseok: '29ffbd5102a98623a02489108492cc19'
  }
})[env] || {};

export default {
  configStoreApiUrl: isPrefix ? `http://${prefix}api.lunchbadger.com/api` : 'http://localhost:3002/api',
  gitBaseUrl: isPrefix ? `http://${prefix}api.lunchbadger.com/git` : 'http://localhost:3002/git',
  projectApiUrl: isPrefix ? `http://internal-{USER}-{ENV}.${subdomain}lunchbadger.io/project-api/api` : 'http://localhost:4230/api',
  workspaceApiUrl: isPrefix ? `http://internal-{USER}-{ENV}.${subdomain}lunchbadger.io/workspace-api/api` : 'http://localhost:4231/api',
  forecastApiUrl: isPrefix ? `http://internal-{USER}-{ENV}.${subdomain}lunchbadger.io/project-api/api` : 'http://localhost:4230/api',
  workspaceUrl: isPrefix ? `http://{USER}-{ENV}.${subdomain}lunchbadger.io` : 'http://localhost:3000',
  expressGatewayAdminApiUrl: `http://admin-{NAME}-{USER}-{ENV}.${subdomain}lunchbadger.io`,
  customerUrl: 'http://workspace-{USER}-{ENV}.customer:3000',
  slsUrl: 'http://fn-{USER}-{ENV}-{FN}:8080',
  kubeWatcherApiUrl: isPrefix ? `http://${prefix}kube-watcher.lunchbadger.com` : 'http://localhost:7788',
  slsApiUrl: `http://sls-{USER}-{ENV}.${subdomain}lunchbadger.io`,
  user: {
    sub: 'demo',
    email: 'foo@lunchbadger.com',
    preferred_username: 'User Userman'
  },
  envId: 'dev',
  features: {
    tritonLogo,
    tritonObjectStorage: true,
    microservices: true,
    apis: isStaging,
    portals: isStaging,
    metrics: isStaging,
    forecasts: isStaging,
    kubeWatcher: true
  },
  logins
};
