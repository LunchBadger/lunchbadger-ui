import ApiClient from '../utils/ApiClient';
import Config from '../../../../src/config';
import {getUser} from '../utils/auth';

class ProjectService {
  initialize = () => this.api = new ApiClient(Config.get('projectApiUrl'), getUser().id_token);

  getProjectId = () => `${getUser().profile.sub}-${Config.get('envId')}`;

  load = () => this.api.get(`/Projects/${this.getProjectId()}`);

  save = data => this.api.patch('/Projects', {body: {id: this.getProjectId(), ...data}});

  clearProject = () => this.api.post(`/Projects/${this.getProjectId()}/clear`);

  monitorStatus = () => this.api.eventSource('/WorkspaceStatus/change-stream');

  ping = () => this.api.get('/WorkspaceStatus/ping');

  restartWorkspace = () => this.api.post('/WorkspaceStatus/restart');

  resetWorkspace = () => this.api.post('/WorkspaceStatus/hard-reset');

  reinstallDeps = () => this.api.post('/WorkspaceStatus/reinstall');

}

export default new ProjectService();
