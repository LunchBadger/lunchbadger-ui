import ApiClient from '../utils/ApiClient';
import Config from '../../../../src/config';
import {getUser} from '../utils/auth';

class KubeWatcherService {
  initialize = () => this.api = new ApiClient(Config.get('kubeWatcherApiUrl'), getUser().id_token);

  monitorStatuses = () => this.api.eventSource(`/channels/${getUser().profile.sub}`);
}

export default new KubeWatcherService();
