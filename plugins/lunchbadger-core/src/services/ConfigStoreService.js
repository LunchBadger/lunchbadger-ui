import ApiClient from '../utils/ApiClient';
import Config from '../../../../src/config';
import {getUser} from '../utils/auth';

class ConfigStoreService {
  initialize = () => this.api = new ApiClient(Config.get('configStoreApiUrl'), getUser().id_token);

  upsertProject = () => this.api.post('/producers', {body: {id: getUser().profile.sub}});
}

class FakeConfigStoreService {
  initialize = () => {};
  upsertProject = () => Promise.resolve();
}

if (Config.get('enableConfigStoreApi') {
  export default new ConfigStoreService();
} else {
  export default new FakeConfigStoreService();
}
