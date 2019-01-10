const {
  utils: {ApiClient, getUser, Config},
} = LunchBadgerCore;

class ApiExplorerService {

  initialize = () => this.api = new ApiClient(Config.get('apiExplorerUrl'), getUser().id_token);

  loadSwaggerJson = () => this.api.get('/explorer/swagger.json');

}

export default new ApiExplorerService();
