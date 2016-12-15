const serverHost = process.env.LBSERVER_HOST || 'localhost';

export default {
  projectApiUrl: `http://${serverHost}:3000/api`,
  workspaceApiUrl: `http://${serverHost}:3001/api`,
  forecastApiUrl: `http://${serverHost}:3000/api`,
  configStoreApiUrl: `http://${serverHost}:3002/api`,
  gitBaseUrl: `http://${serverHost}:3002/git`,
  user: {
    sub: 'demo',
    email: 'foo@lunchbadger.com',
    preferred_username: 'User Userman'
  },
  envId: 'dev'
};
