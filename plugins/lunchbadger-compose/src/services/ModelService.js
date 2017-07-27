import Config from '../../../../src/config';

const {ApiClient, getUser} = LunchBadgerCore.utils;

class ModelService {

  initialize = () => this.api = new ApiClient(Config.get('workspaceApiUrl'), getUser().idToken);

  load = () => this.api.get('Facets/server/models?filter[include]=properties&filter[include]=relations');

  upsert = body => this.api.post('ModelDefinitions', {body});

  delete = id => this.api.delete(`ModelDefinitions/${id}`);

  //
  // upsertModelConfig(data) {
  //   return this._workspaceClient.post('ModelConfigs', { body: data });
  // }
  //
  // deleteModelConfig(id) {
  //   return this._workspaceClient.delete(`ModelConfigs/${id}`);
  // }
  //
  // upsertModelProperties(body) {
  //   return this._workspaceClient.post('ModelProperties', {body});
  // }
  //
  // deleteModelProperties(modelId) {
  //   return this._workspaceClient.delete(`ModelDefinitions/${modelId}/properties`);
  // }
  //
  // upsertModelRelations(body) {
  //   return this._workspaceClient.post('ModelRelations', {body});
  // }
  //
  // deleteModelRelations(modelId) {
  //   return this._workspaceClient.delete(`ModelDefinitions/${modelId}/relations`);
  // }

}

export default new ModelService();
