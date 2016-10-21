import ApiClient from '../utils/ApiClient';
import {bindParams} from '../utils/URLParamsBind';


export default class ProjectService {
  constructor(projectUrl, workspaceUrl, idToken) {
    this._projectClient = new ApiClient(projectUrl, idToken);
    this._workspaceClient = new ApiClient(workspaceUrl, idToken);
  }

  get(producerId, envId) {
    return Promise.all([
      this._projectClient.get('Projects'),
      this._workspaceClient.get('Facets/main/models?filter[include]=properties&filter[include]=relations'),
      this._workspaceClient.get('Facets/main/datasources'),
      this._workspaceClient.get('Facets/main/modelConfigs')
    ]);
  }

  save(producerId, envId, data, rev) {
    let req = {
      body: {
        [envId + '/project.json']: JSON.stringify(data, null, '  ')
      }
    };

    if (rev) {
      req.headers = {
        'If-Match': rev
      };
    }
    return this._projectClient.patch(bindParams(
        'producers/:producerId/envs/:envId/files', {producerId, envId}), req);
  }
}
