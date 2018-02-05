const env = process.env.LB_ENV || 'staging'; // staging|triton|sra|localhost

const tritonLogo = ['triton', 'sra'].includes(env);
const isPrefix = env !== 'localhost';
const prefix = isPrefix ? `${env}-` : '';
const subdomain = isPrefix ? `${env}.` : '';
const logins = ({
  sra: {
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
  kubeWatcherApiUrl: isPrefix ? `http://${prefix}kube-watcher.lunchbadger.com` : 'http://localhost:7788',
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
    apis: true,
    portals: true,
    metrics: true,
    forecasts: true,
    kubeWatcher: true
  },
  logins
};
