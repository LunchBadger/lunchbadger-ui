import Config from '../../../../src/config';

const {ApiClient, getUser} = LunchBadgerCore.utils;

class SLSService {

  initialize = () => this.api = new ApiClient(Config.get('slsApiUrl'), getUser().id_token);

  create = name => this.api.post('/service', {body: {name}});

  deploy = name => {}; // this.api.post(`/deploy/${name}`);

  list = () => this.api.get('/service');

  get = name => this.api.get(`/service/${name}`);

  update = (name, body) => this.api.put(`/service/${name}`, {body});

  remove = name => this.api.delete(`/service/${name}`);

}

export default new SLSService();
