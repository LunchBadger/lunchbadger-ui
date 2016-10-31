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

  save(data) {
    return this._projectClient.put('Projects', { body: data });
  }
}
