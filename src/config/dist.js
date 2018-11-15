export default {
  enableConfigStoreApi: false,
  configStoreApiUrl: 'https://api.lunchbadger.com/api',
  gitBaseUrl: 'https://api.lunchbadger.com/git',
  projectApiUrl: 'https://internal-{USER}-{ENV}.lunchbadger.io/project-api/api',
  workspaceApiUrl: 'https://internal-{USER}-{ENV}.lunchbadger.io/workspace-api/api',
  forecastApiUrl: 'https://internal-{USER}-{ENV}.lunchbadger.io/project-api/api',
  workspaceUrl: 'https://{USER}-{ENV}.lunchbadger.io',
  apiExplorerUrl: 'https://{USER}-{ENV}.lunchbadger.io/explorer',
  expressGatewayAdminApiUrl: 'https://admin-{NAME}-{USER}-{ENV}.lunchbadger.io',
  expressGatewayAccessApiUrl: 'https://{NAME}-{USER}-{ENV}.lunchbadger.io',
  customerUrl: 'http://workspace-{USER}-{ENV}.customer:3000',
  slsUrl: 'http://fn-{USER}-{ENV}-{FN}:8080',
  kubeWatcherApiUrl: 'https://kube-watcher.lunchbadger.com',
  slsApiUrl: 'https://sls-{USER}-{ENV}.lunchbadger.io',
  sshManagerUrl: 'https://api.lunchbadger.com/users/customer/{USER}',
  loopbackGitCloneCommand: 'git clone git@git.lunchbadger.com:customer-{USER}/{ENV}.git',
  serverlessGitCloneCommand: 'git clone git@git.lunchbadger.com:customer-{USER}/functions.git',
  googleAnalyticsID: 'UA-82427970-1',
  docsUrl: 'https://docs.lunchbadger.com',
  homepageUrl: 'https://www.lunchbadger.com',
  pingAmount: 72,
  pingIntervalMs: 2500,
  oauth: {
    authority: 'https://www.lunchbadger.com',
    client_id: '4kzhU5LqlUpQJmjbMevWkWyt9adeKK',
    redirect_uri: 'https://app.lunchbadger.com',
    scope: 'openid profile email',
    automaticSilentRenew: true,
    metadata: {
      issuer: 'https://www.lunchbadger.com',
      authorization_endpoint: 'https://www.lunchbadger.com/oauth/authorize',
      userinfo_endpoint: 'https://www.lunchbadger.com/oauth/me',
      end_session_endpoint: 'https://www.lunchbadger.com/logout/'
    },
    signingKeys: [
      {
        'kid': 'main',
        'kty': 'RSA',
        'n': 'zfk-2xgiat95VgYmT1Y8LjHnVSwgo9qwQ9J7Y6YY1rx3yesZMV9azPz41qWociROqZNLnKZq1fSuDErmmHJwfTD5uPGYzOHSznM_sQpspzUbEDQ5zvj1nBAnIhczuEm9du5PfUBOFZw4e1rFG55qJfoO4tQg4pWKWj8upf0psk7jwhaK-b7YSHA8c5Fq8UwhvMGxPYqP6djy7mNlcQ11-tgEu7TlG6DxVCRGM1nr5bz855uhHZ4vFjOQL5cRG_hO5Z9tv2OJzy39Hc8IkYMVU527aiLysb-B1eU0Q_xHj8c2kHF6xY6h4jbUvaaRUI8TxhbVwCIMr4kJ2tTbxRq-wrfBOGwINuTJYuw3HHxH74BLBgk7OFd5ReR2IlKc6TFiQnaPTgsejmOad196MgAazrvSdKa-w8v52T3Z09V6KirZmrZw5-6ngLl_pKNVq-bqHmAE0xyX6Uwf-lpNOow7mjaHYXc5ISrREk4pGPhNEyYxvMOTECH9AzORDJM0hTLFhbcbgHrEp5MtsCm4fx_JwkuugLIPL_Z2kHXdVJkah9NoqlvyfLNoRLrjWU7V4RlDyEnVZzTGqcRKiyPeTcdnFlu4CHwI_tHvb4AMsfdbq8ZKAyWGeS7QvC8H5qjTTdeiQfX13kl4BlTQhwBXBz7MkeYIFZUqFWPH8goqvdoTtyM',
        'e': 'AQAB'
      }
    ]
  },
  envId: 'dev',
  features: {
    tritonLogo: false,
    tritonObjectStorage: false,
    microservices: false,
    apis: false,
    portals: false,
    metrics: false,
    forecasts: false,
    kubeWatcher: true,
    consumerManagement: true,
    gitAccess: false,
    uploadPublicKeys: false,
    appUrls: false,
    workspaceButtons: false,
    apiExplorer: false,
    fnTypes: [
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
        label: 'Python 2.7',
        value: 'python:2.7'
      },
      {
        label: 'Python 3.6',
        value: 'python:3.6'
      }
    ]
  }
};
