import ApiClient from '../utils/ApiClient';
import {bindParams} from '../utils/URLParamsBind';

export default class ProjectService {
  constructor(projectUrl, workspaceUrl, idToken) {
    this._projectClient = new ApiClient(projectUrl, idToken);
    this._workspaceClient = new ApiClient(workspaceUrl, idToken);
  }

  get() {
    return Promise.all([
      this._projectClient.get('Projects'),
      this._workspaceClient.get('Facets/main/models?filter[include]=properties&filter[include]=relations'),
      this._workspaceClient.get('Facets/main/datasources'),
      this._workspaceClient.get('Facets/main/modelConfigs')
    ]);
  }

  putDataSource(data) {
    return this._workspaceClient.put('DataSourceDefinitions', { body: data });
  }

  deleteDataSource(id) {
    return this._workspaceClient.delete(
      bindParams('DataSourceDefinitions/:id', {id}));
  }

  putModel(data) {
    return this._workspaceClient.put('ModelDefinitions', { body: data });
  }

  deleteModel(id) {
    return this._workspaceClient.delete(
      bindParams('ModelDefinitions/:id', {id}));
  }

  deleteModelConfig(id) {
    return this._workspaceClient.delete(bindParams('ModelConfigs/:id', {id}));
  }

  upsertModelConfig(data) {
    return this._workspaceClient.patch('ModelConfigs', { body: data });
  }

  save(data) {
    return this._projectClient.put('Projects', { body: data });
  }
}
