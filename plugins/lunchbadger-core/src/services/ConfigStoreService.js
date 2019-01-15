import ApiClientNew from '../utils/ApiClientNew';
import Config from '../../../../src/config';
import {getUser} from '../utils/auth';

const enableConfigStoreApi = Config.get('enableConfigStoreApi');

class ConfigStoreService {
  initialize = () => {
    if (enableConfigStoreApi) {
      this.api = new ApiClientNew(Config.get('configStoreApiUrl'), getUser().id_token);
    }
  };

  upsertProject = () => {
    if (enableConfigStoreApi) {
      return this.api.post('/producers', {data: {id: getUser().profile.sub}});
    }
    return Promise.resolve();
  }
}

export default new ConfigStoreService();
