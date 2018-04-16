import ApiClient from '../utils/ApiClient';
import Config from '../../../../src/config';
import {getUser} from '../utils/auth';

class SshManagerService {
  initialize = () => this.api = new ApiClient(Config.get('sshManagerUrl'), getUser().id_token);

  load = () => this.api.get('/ssh');

  remove = id => this.api.delete(`/ssh/${id}`);

}

export default new SshManagerService();
