import ApiClient from '../utils/ApiClient';
import Config from '../../../../src/config';
import {getUser} from '../utils/auth';

class ConfigStoreService {
  initialize = () => this.api = new ApiClient(Config.get('configStoreApiUrl'), getUser().id_token);

  upsertProject = () => this.api.post('producers', {body: {id: getUser().profile.sub}});

  getAccessKey = () => this.api.get(`producers/${getUser().profile.sub}/accesskey`);

  regenerateAccessKey = () => this.api.post(`producers/${getUser().profile.sub}/accesskey`);

}

export default new ConfigStoreService();
