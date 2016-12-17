import ApiClient from '../utils/ApiClient';
import {bindParams} from '../utils/URLParamsBind';

export default class ConfigStoreService {
  constructor(url, idToken) {
    this._client = new ApiClient(url, idToken);
  }

  upsertProject(userId) {
    let project = { id: userId };
    return this._client.post('producers', { body: project });
  }

  getAccessKey(userId) {
    return this._client.get(bindParams('producers/:userId/accesskey',
      {userId: userId}));
  }

  regenerateAccessKey(userId) {
    return this._client.post(bindParams('producers/:userId/accesskey',
      {userId: userId}));
  }
}
