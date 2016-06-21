import baseConfig from './base';

let config = {
  apiUrl: 'http://lunchbadger.ntrc.eu/api',
  appEnv: 'dist'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
