import config from 'config';

const mkUrl = (url, user, env) => url.replace('{USER}', user).replace('{ENV}', env);

class Cfg {
  constructor(config) {
    this.data = {};
    this.setMulti(config);
  }

  set(key, val) {
    this.data[key] = val;
  }

  setMulti(options) {
    Object.keys(options).map((key) => this.set(key, options[key]));
  }

  get(key) {
    return this.data[key];
  }

  apiUrlReplacements(key, user) {
    this.set(key, mkUrl(config[key], user, this.get('envId')));
  }

  apiUrlsReplacements(user) {
    ['workspaceUrl', 'projectApiUrl', 'workspaceApiUrl', 'forecastApiUrl'].forEach((key) => {
      this.apiUrlReplacements(key, user);
    });
  }
}

export default new Cfg(config);
