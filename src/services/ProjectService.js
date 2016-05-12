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
}

export default new ProjectService();
