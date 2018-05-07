export default {
  configStoreApiUrl: 'https://api.lunchbadger.com/api',
  gitBaseUrl: 'https://api.lunchbadger.com/git',
  projectApiUrl: 'https://internal-{USER}-{ENV}.lunchbadger.io/project-api/api',
  workspaceApiUrl: 'https://internal-{USER}-{ENV}.lunchbadger.io/workspace-api/api',
  forecastApiUrl: 'https://internal-{USER}-{ENV}.lunchbadger.io/project-api/api',
  workspaceUrl: 'https://{USER}-{ENV}.lunchbadger.io',
  expressGatewayAdminApiUrl: 'https://admin-{NAME}-{USER}-{ENV}.lunchbadger.io',
  expressGatewayAccessApiUrl: 'https://{NAME}-{USER}-{ENV}.lunchbadger.io',
  customerUrl: 'http://workspace-{USER}-{ENV}.customer:3000',
  slsUrl: 'http://fn-{USER}-{ENV}-{FN}:8080',
  kubeWatcherApiUrl: 'https://kube-watcher.lunchbadger.com',
  slsApiUrl: 'https://sls-{USER}-{ENV}.lunchbadger.io',
  sshManagerUrl: 'https://api.lunchbadger.com/users/customer/{USER}',
  gitCloneCommand: 'git clone git@git.lunchbadger.com:customer-{USER}/{ENV}.git',
  oauth: {
    authority: 'https://www.lunchbadger.com',
    client_id: '4kzhU5LqlUpQJmjbMevWkWyt9adeKK',
    redirect_uri: 'https://app.lunchbadger.com',
    scope: 'openid profile email',
    metadata: {
      issuer: 'https://www.lunchbadger.com',
      authorization_endpoint: 'https://www.lunchbadger.com/oauth/authorize',
      userinfo_endpoint: 'https://www.lunchbadger.com/oauth/me',
      end_session_endpoint: 'https://www.lunchbadger.com/logout'
    },
    // use pem-jwk npm to produce this from the public key in the OIDC server
    signingKeys: [
      {
        'kid': 'main',
        'kty': 'RSA',
        'n': '7ATrA_pvXdzabRID6pBAA-i2zez6FG3SXw5peAV2oQUmd64JbO2vUMih4PIt5D_o6gHfzQDwI_5e8wpiNKKp81dpvy3uYecyfGT4x-FYQ4xj0p7dnczPlp5t1ottCXYQyyB07UZ4UsOT063CRhgi00HhlURBm-yjLwnlZv_VGDNzXNFX1-t-PbGC5Ab7R02Fsnp8TGfjUgzA6NDgerKiJcq_fSxRb5WSB_gscCGGWjvgIJrHOLI9ofaXFpoHCxePCsVkaR0JNz8Q89tIWvWv5msm062aD7y1ThfP6I3HeGf3dT6IavLOVD6Wk82_WN-aaQ7BKOstglWqzjJvcEvUOQ',
        'e': 'AQAB'
      }
    ]
  },
  envId: 'dev',
  features: {
    tritonLogo: false,
    tritonObjectStorage: true,
    microservices: true,
    apis: false,
    portals: false,
    metrics: false,
    forecasts: false,
    kubeWatcher: true,
    consumerManagement: false
  }
};
