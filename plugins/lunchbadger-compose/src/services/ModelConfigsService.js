import Config from '../../../../src/config';

const {ApiClient, getUser} = LunchBadgerCore.utils;

class ModelConfigsService {

  initialize = () => this.api = new ApiClient(Config.get('workspaceApiUrl'), getUser().id_token);

  load = () => this.api.get('Facets/server/modelConfigs');

}

export default new ModelConfigsService();
