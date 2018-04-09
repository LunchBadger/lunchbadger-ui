import Config from '../../../../src/config';

const {ApiClient, getUser} = LunchBadgerCore.utils;

class WorkspaceFilesService {

  initialize = () => this.api = new ApiClient(Config.get('projectApiUrl'), getUser().id_token);

  load = () => this.api.get('/WorkspaceFiles/files');

  update = body => this.api.put('/WorkspaceFiles/files', {body});

}

export default new WorkspaceFilesService();
