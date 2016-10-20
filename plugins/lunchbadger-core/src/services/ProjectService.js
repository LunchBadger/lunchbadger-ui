import ApiClient from '../utils/ApiClient';
import {bindParams} from '../utils/URLParamsBind';

export default class ProjectService {
  constructor(apiUrl, idToken) {
    this._APIHandle = new ApiClient(apiUrl, idToken);
  }

  get(producerId, envId) {
    return this._APIHandle.get(bindParams(
      'producers/:producerId/envs/:envId/files/:envId/project.json', {producerId, envId}));
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
    return this._APIHandle.patch(bindParams(
        'producers/:producerId/envs/:envId/files', {producerId, envId}), req);
  }
}
