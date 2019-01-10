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
  enableConfigStoreApi: true,
  configStoreApiUrl: isPrefix ? `http://${prefix}api.lunchbadger.com/api` : 'http://localhost:3002/api',
  gitBaseUrl: isPrefix ? `http://${prefix}api.lunchbadger.com/git` : 'http://localhost:3002/git',
  projectApiUrl: isPrefix ? `http://internal-{USER}-{ENV}.${subdomain}lunchbadger.io/project-api/api` : 'http://localhost:4230/api',
  workspaceApiUrl: isPrefix ? `http://internal-{USER}-{ENV}.${subdomain}lunchbadger.io/workspace-api/api` : 'http://localhost:4231/api',
  forecastApiUrl: isPrefix ? `http://internal-{USER}-{ENV}.${subdomain}lunchbadger.io/project-api/api` : 'http://localhost:4230/api',
  workspaceUrl: isPrefix ? `http://{USER}-{ENV}.${subdomain}lunchbadger.io` : 'http://localhost:3000',
  apiExplorerUrl: `http://internal-{USER}-{ENV}.${subdomain}lunchbadger.io/explorer`,
  apiExplorerHost: isPrefix ? `internal-{USER}-{ENV}.${subdomain}lunchbadger.io/explorer` : 'localhost:3000',
  expressGatewayAdminApiUrl: `http://admin-{NAME}-{USER}-{ENV}.${subdomain}lunchbadger.io`,
  expressGatewayAccessApiUrl: `http://{NAME}-{USER}-{ENV}.${subdomain}lunchbadger.io`,
  customerUrl: 'http://workspace-{USER}-{ENV}.customer:3000',
  slsUrl: 'http://fn-{USER}-{ENV}-{FN}:8080',
  kubeWatcherApiUrl: isPrefix ? `http://${prefix}kube-watcher.lunchbadger.com` : 'http://localhost:7788',
  slsApiUrl: isPrefix ? `http://sls-{USER}-{ENV}.${subdomain}lunchbadger.io` : 'http://localhost:4444',
  sshManagerUrl: `http://${prefix}api.lunchbadger.com/users/customer/{USER}`,
  loopbackGitCloneCommand: `git clone git@${prefix}git.lunchbadger.com:customer-{USER}/{ENV}.git`,
  serverlessGitCloneCommand: `git clone git@${prefix}git.lunchbadger.com:customer-{USER}/functions.git`,
  googleAnalyticsID: 'UA-82427970-1',
  docsUrl: 'https://docs.lunchbadger.com',
  homepageUrl: 'https://www.lunchbadger.com',
  pingAmount: 72,
  pingIntervalMs: 2500,
  user: {
    sub: 'demo',
    email: 'foo@lunchbadger.com',
    preferred_username: 'User Userman'
  },
  envId: 'dev',
  mocks: false,
  features: {
    tritonLogo,
    tritonObjectStorage: true,
    microservices: true,
    apis: isStaging,
    portals: isStaging,
    metrics: isStaging,
    forecasts: isStaging,
    kubeWatcher: true,
    consumerManagement: isStaging,
    gitAccess: true,
    uploadPublicKeys: true,
    appUrls: false,
    workspaceButtons: true,
    apiExplorer: true,
    slsModelConnectorsTriggers: true,
    slsModelsTriggers: true,
    fnTypes: [
      {
        label: '.Net Core 2.0',
        value: 'dotnetcore:2.0'
      },
      {
        label: 'Go 1.10',
        value: 'go:1.10'
      },
      {
        label: 'Java 8',
        value: 'java:1.8'
      },
      {
        label: 'Node 6',
        value: 'nodejs:6'
      },
      {
        label: 'Node 8',
        value: 'nodejs:8',
        defaultSelected: true
      },
      {
        label: 'PHP 7.2',
        value: 'php:7.2'
      },
      {
        label: 'Python 2.7',
        value: 'python:2.7'
      },
      {
        label: 'Python 3.6',
        value: 'python:3.6'
      },
      {
        label: 'Ruby 2.4',
        value: 'ruby:2.4'
      }
    ]
  },
  logins
};
