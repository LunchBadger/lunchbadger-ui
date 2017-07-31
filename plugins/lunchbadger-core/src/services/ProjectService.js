import ApiClient from '../utils/ApiClient';
import Config from '../../../../src/config';
import {getUser} from '../utils/auth';

class ProjectService {
  initialize = () => this.api = new ApiClient(Config.get('projectApiUrl'), getUser().idToken);
  // this._workspaceClient = new ApiClient(Config.get('workspaceApiUrl'), idToken);

  getProjectId = () => `${getUser().profile.sub}-${Config.get('envId')}`;

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

  load = () => this.api.get(`Projects/${this.getProjectId()}`);

  save = data => this.api.patch('Projects', {body: {id: this.getProjectId(), ...data}});

  clearProject = () => this.api.post(`Projects/${this.getProjectId()}/clear`);

  monitorStatus = () => this.api.eventSource('/WorkspaceStatus/change-stream');

  ping = () => this.api.get('/WorkspaceStatus/ping');

  restartWorkspace = () => this.api.post('/WorkspaceStatus/restart');

  reinstallDeps = () => this.api.post('/WorkspaceStatus/reinstall');

}

export default new ProjectService();
