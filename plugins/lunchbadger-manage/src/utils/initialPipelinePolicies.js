const initialPolicies = [
  'oauth2',
  'rate-limiter',
  'simple-logger',
];

export default initialPolicies.map(key => ({[key]: []}));
