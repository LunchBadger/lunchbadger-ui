import Config from '../../../../src/config';

const {ApiClient, getUser} = LunchBadgerCore.utils;

class ModelService {

  initialize = () => this.api = new ApiClient(Config.get('workspaceApiUrl'), getUser().idToken);

  load = () => this.api.get('Facets/server/models?filter[include]=properties&filter[include]=relations');

}

export default new ModelService();
