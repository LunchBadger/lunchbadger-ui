const {
  utils: {ApiClient, getUser, Config},
} = LunchBadgerCore;

class ModelService {

  initialize = () => this.api = new ApiClient(Config.get('workspaceApiUrl'), getUser().id_token);

  load = () => this.api.get(
    '/Facets/server/models'
      + '?filter[include]=properties'
      + '&filter[include]=relations'
      + '&filter[include]=methods'
  );

  upsert = body => this.api.post('/ModelDefinitions', {body});

  delete = id => this.api.delete(`/ModelDefinitions/${id}`);

  upsertModelConfig = data => this.api.post('/ModelConfigs', { body: data });

  deleteModelConfig = id => this.api.delete(`/ModelConfigs/${id}`);

  upsertProperties = body => this.api.post('/ModelProperties', {body});

  deleteProperties = modelId => this.api.delete(`/ModelDefinitions/${modelId}/properties`);

  upsertRelations = body => this.api.post('/ModelRelations', {body});

  deleteRelations = modelId => this.api.delete(`/ModelDefinitions/${modelId}/relations`);

  upsertMethods = body => this.api.post('/ModelMethods', {body});

  deleteMethods = modelId => this.api.delete(`/ModelDefinitions/${modelId}/methods`);

}

export default new ModelService();
