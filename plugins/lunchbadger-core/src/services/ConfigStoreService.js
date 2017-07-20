import ApiClient from '../utils/ApiClient';
import Config from '../../../../src/config';
import {getUser} from '../utils/auth';

class ConfigStoreService {
  initialize() {
    this._client = new ApiClient(Config.get('configStoreApiUrl'), getUser().idToken);
  }

  upsertProject() {
    return this._client.post('producers', {body: {id: getUser().profile.sub}});
  }

  getAccessKey = () => this._client.get(`producers/${getUser().profile.sub}/accesskey`);

  regenerateAccessKey = () => this._client.post(`producers/${getUser().profile.sub}/accesskey`);
}

export default new ConfigStoreService();
