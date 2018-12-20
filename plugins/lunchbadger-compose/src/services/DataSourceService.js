const {
  utils: {ApiClient, getUser, Config},
} = LunchBadgerCore;

class DataSourceService {

  initialize = () => this.api = new ApiClient(Config.get('workspaceApiUrl'), getUser().id_token);

  load = () => this.api.get('/Facets/server/datasources');

  upsert = body => this.api.post('/DataSourceDefinitions', {body});

  delete = id => this.api.delete(`/DataSourceDefinitions/${id}`);

}

export default new DataSourceService();
