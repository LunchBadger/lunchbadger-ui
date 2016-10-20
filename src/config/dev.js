const serverHost = process.env.LBSERVER_HOST || 'localhost';

export default {
  projectApiUrl: `http://${serverHost}:3000/api`,
  workspaceApiUrl: `http://${serverHost}:3001/api`,
  forecastApiUrl: `http://${serverHost}:3000/api`,
  user: {
    sub: 'demo',
    email: 'foo@lunchbadger.com',
    preferred_username: 'User Userman'
  },
  envId: 'dev'
};
