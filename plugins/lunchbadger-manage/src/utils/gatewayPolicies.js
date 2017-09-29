const GATEWAY_POLICIES = {
  BASIC_AUTH: 'basic-auth',
  CORS: 'cors',
  KEY_AUTH: 'key-auth',
  OAUTH2: 'oauth2',
  PROXY: 'proxy',
  RATE_LIMIT: 'rate-limit',
  LOG: 'log',
};

export const gatewayPolicies = Object.keys(GATEWAY_POLICIES).map(key => GATEWAY_POLICIES[key]);

export default GATEWAY_POLICIES;
