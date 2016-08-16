import baseConfig from './base';

let config = {
  apiUrl: 'http://localhost:3000/api',
  appEnv: 'dev'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
