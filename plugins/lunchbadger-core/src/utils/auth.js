/*eslint no-console:0 */
import {UserManager} from 'oidc-client';

export default function checkAuth(config) {
  const um = new UserManager(config.oauth);

  return um.getUser()
    .then(user => {
      if (!user) {
        console.log('not logged in, checking callback status');
        return um.signinRedirectCallback().catch(err => {
          if (err.toString().indexOf('No state in response') != -1) {
            console.log('not in oauth callback');
            return null;
          } else {
            throw err;
          }
        });
      }
      return user;
    })
    .then(user => {
      if (!user) {
        console.log('redirecting to authorization endpoint');
        um.signinRedirect();
        return null;
      }
      return user;
    })
    .then(user => {
      if (!user) {
        return null;
      }
      console.log('logged in:', user);
      return user;
    })
    .catch(err => {
      console.error(err);
    });
}
