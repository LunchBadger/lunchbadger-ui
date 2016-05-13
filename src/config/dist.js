import baseConfig from './base';

let config = {
  apiUrl: 'http://0.0.0.0:3000/api',
  appEnv: 'dist'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
