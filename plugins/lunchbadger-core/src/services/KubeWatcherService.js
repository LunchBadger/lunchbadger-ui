import ApiClient from '../utils/ApiClient';
import Config from '../../../../src/config';
import {getUser} from '../utils/auth';
import userStorage from '../utils/userStorage';

class KubeWatcherService {
  initialize = () => this.api = new ApiClient(Config.get('kubeWatcherApiUrl'), getUser().id_token);

  getProjectId = () => `${userStorage.getActiveUsername()}-${userStorage.getActiveProject()}`;

  monitorStatuses = () => this.api.eventSource(`/v2/channels/${this.getProjectId()}`);
}

export default new KubeWatcherService();
