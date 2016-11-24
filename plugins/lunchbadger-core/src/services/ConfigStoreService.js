import ApiClient from '../utils/ApiClient';

export default class ConfigStoreService {
  constructor(url, idToken) {
    this._client = new ApiClient(url, idToken);
  }

  upsertProject(userId) {
    let project = { id: userId };
    return this._client.post('producers', { body: project });
  }
}
