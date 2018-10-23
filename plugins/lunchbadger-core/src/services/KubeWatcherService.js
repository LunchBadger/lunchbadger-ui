import ApiClient from '../utils/ApiClient';
import Config from '../../../../src/config';
import {getUser} from '../utils/auth';

class KubeWatcherService {
  initialize = () => this.api = new ApiClient(Config.get('kubeWatcherApiUrl'), getUser().id_token);

  getProjectId = () => `${getUser().profile.sub}-${Config.get('envId')}`;

  monitorStatuses = () => this.api.eventSource(`/v2/channels/${this.getProjectId()}`);
}

export default new KubeWatcherService();
