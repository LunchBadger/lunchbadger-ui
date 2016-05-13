import APIInterceptor from '../utils/APIInterceptor';
import {bindParams} from '../utils/URLParamsBind';

class ProjectService {
  constructor() {
    this._APIHandle = new APIInterceptor();
  }

  getAll() {
    return this._APIHandle.get('Projects');
  }

  get(projectId) {
    return this._APIHandle.get(bindParams('Projects', {id: projectId}));
  }

  save(projectId, data) {
    return this._APIHandle.put(bindParams('Projects/:id', {id: projectId}), {
      body: data
    });
  }
}

export default new ProjectService();
