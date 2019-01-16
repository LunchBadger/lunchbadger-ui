const {
  utils: {ApiClient, getUser, Config},
} = LunchBadgerCore;

class SLSService {

  initialize = () => this.api = new ApiClient(Config.get('slsApiUrl'), getUser().id_token);

  create = body => this.api.post('/service', {body});

  deploy = name => this.api.post('/deploy', {body: {name}});

  load = () => this.api.get('/service');

  get = name => this.api.get(`/service/${name}`);

  update = (name, body) => this.api.put(`/service/${name}`, {body});

  remove = name => this.api.delete(`/service/${name}`);

  loadLogs = name => this.api.get(`/service/${name}/logs`);

  clear = () => this.api.delete('/service');

}

export default new SLSService();
