import slug from 'slug';
import Config from '../../../../src/config';

const {ApiClient, getUser} = LunchBadgerCore.utils;

class ExpressGatewayAdminService {
  initialize = name => this.api = new ApiClient(Config.get('expressGatewayAdminApiUrl').replace('{NAME}', slug(name, {lower: true})), getUser().id_token);

  // getProjectId = () => `${getUser().profile.sub}-${Config.get('envId')}`;

  getServiceEndpoints = () => this.api.get('/service-endpoints');

  deleteServiceEndpoint = name => this.api.delete(`/service-endpoints/${name}`);

  putServiceEndpoint = (name, body) => this.api.put(`/service-endpoints/${name}`, {body});

  getApiEndpoints = () => this.api.get('/api-endpoints');

  deleteApiEndpoint = name => this.api.delete(`/api-endpoints/${name}`);

  putApiEndpoint = (name, body) => this.api.put(`/api-endpoints/${name}`, {body});

  getPipelines = () => this.api.get('/pipelines');

  deletePipeline = name => this.api.delete(`/pipelines/${name}`);

  putPipeline = (name, body) => this.api.put(`/pipelines/${name}`, {body});

}

export default ExpressGatewayAdminService;
