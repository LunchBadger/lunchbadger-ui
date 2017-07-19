/*eslint no-console:0 */
import {UserManager} from 'oidc-client';
import Config from '../../../../src/config';

export class LoginManager {
  constructor(config) {
    this.um = new UserManager(config);
    this.user = undefined;
  }

  checkAuth() {
    return this.um.getUser()
      .then(user => {
        if (!user) {
          console.debug('not logged in, checking callback status');
          return this.um.signinRedirectCallback().catch(err => {
            if (err.toString().indexOf('No state in response') != -1) {
              console.debug('not in oauth callback');
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
          console.debug('redirecting to authorization endpoint');
          this.um.signinRedirect();
          return null;
        }
        return user;
      })
      .then(user => {
        if (!user) {
          return false;
        }
        console.debug('logged in:', user);
        window.location = '#';
        this.user = user;
        Config.apiUrlsReplacements(this.user.profile.sub);
        return true;
      })
      .catch(err => {
        console.error(err);
        return false;
      });
  }

  refreshLogin() {
    let attempts = Number(window.localStorage.getItem('login_refresh_attempts')) || 0;
    if (attempts < 1) {
      window.localStorage.setItem('login_refresh_attempts', attempts + 1);
      return this.um.removeUser().then(() => {
        this.um.signinRedirect();
      });
    } else {
      // Don't try to refresh again automatically, but do reset so that further
      // action will refresh again.
      window.localStorage.setItem('login_refresh_attempts', 0);
    }
  }
}

export class DummyLoginManager {
  constructor(user) {
    this.user = {
      profile: user
    };
  }

  checkAuth() {
    Config.apiUrlsReplacements(this.user.profile.sub);
    return Promise.resolve(this.user);
  }

  refreshLogin() {
    // Dummy login doesn't do this
  }
}

let loginManager;

export const createLoginManager = () => {
  if (Config.get('user')) {
    loginManager = new DummyLoginManager(Config.get('user'));
  } else {
    loginManager = new LoginManager(Config.get('oauth'));
  }
  return loginManager;
}

export default () => loginManager;

export const getUser = () => loginManager.user;
