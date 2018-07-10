import ApiClient from '../utils/ApiClient';
import Config from '../../../../src/config';
import {getUser} from '../utils/auth';

const enableConfigStoreApi = Config.get('enableConfigStoreApi');

class ConfigStoreService {
  initialize = () => {
    if (enableConfigStoreApi) {
      this.api = new ApiClient(Config.get('configStoreApiUrl'), getUser().id_token);
    }
  };

  upsertProject = () => {
    if (enableConfigStoreApi) {
      return this.api.post('/producers', {body: {id: getUser().profile.sub}});
    }
    return Promise.resolve();
  }
}

export default new ConfigStoreService();
