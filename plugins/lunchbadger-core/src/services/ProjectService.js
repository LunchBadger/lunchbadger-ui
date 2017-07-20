import ApiClient from '../utils/ApiClient';
import Config from '../../../../src/config';
import {getUser} from '../utils/auth';

class ProjectService {
  initialize = () => this.api = new ApiClient(Config.get('projectApiUrl'), getUser().idToken);
  // this._workspaceClient = new ApiClient(Config.get('workspaceApiUrl'), idToken);

  getProjectId() {
    return `${getUser().profile.sub}-${Config.get('envId')}`;
  }

  // get() {
  //   return Promise.all([
  //     this.api
  //       .get(`Projects/${this.getProjectId()}`)
  //       .catch(err => {
  //         if (err.statusCode === 404) {
  //           return {body: null};
  //         }
  //         throw err;
  //       }),
  //     this._workspaceClient.get('Facets/server/models?filter[include]=properties&filter[include]=relations'),
  //     this._workspaceClient.get('Facets/server/datasources'),
  //     this._workspaceClient.get('Facets/server/modelConfigs')
  //   ]);
  // }

  load = () => this.api.get(`Projects/${this.getProjectId()}`).catch(err => {
    if (err.statusCode === 404) {
      return {body: null};
    }
    throw err;
  });

  // upsertDataSource(body) {
  //   return this._workspaceClient.post('DataSourceDefinitions', {body});
  // }
  //
  // deleteDataSource(id) {
  //   return this._workspaceClient.delete(`DataSourceDefinitions/${id}`);
  // }
  //
  // upsertModel(body) {
  //   return this._workspaceClient.post('ModelDefinitions', {body});
  // }
  //
  // deleteModel(id) {
  //   return this._workspaceClient.delete(`ModelDefinitions/${id}`);
  // }
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

  save(data) {
    return this.api.patch('Projects', {body: {
      id: this.getProjectId(),
      ...data,
    }});
  }

  clearProject() {
    return this.api.post(`Projects/${this.getProjectId()}/clear`);
  }

  monitorStatus() {
    return this.api.eventSource('/WorkspaceStatus/change-stream');
  }

  ping() {
    return this.api.get('/WorkspaceStatus/ping');
  }

  restartWorkspace() {
    return this.api.post('/WorkspaceStatus/restart');
  }

  reinstallDeps() {
    return this.api.post('/WorkspaceStatus/reinstall');
  }
}

export default new ProjectService();
