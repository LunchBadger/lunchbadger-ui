import slug from 'slug';
import Config from '../../../../src/config';

const {ApiClient, getUser} = LunchBadgerCore.utils;

class ExpressGatewayAdminService {
  initialize = name => this.api = new ApiClient(Config.get('expressGatewayAdminApiUrl').replace('{NAME}', slug(name, {lower: true})), getUser().id_token);

  // getProjectId = () => `${getUser().profile.sub}-${Config.get('envId')}`;

  getServiceEndpoints = () => {
    console.log('EGADMIN CALL', 'getServiceEndpoints', 'service-endpoints');
    return this.api.get('/service-endpoints');
  }

  deleteServiceEndpoint = name => {
    console.log('EGADMIN CALL', 'deleteServiceEndpoint', `/service-endpoints/${name}`);
    return this.api.delete(`/service-endpoints/${name}`);
  }

  putServiceEndpoint = (name, body) => {
    console.log('EGADMIN CALL', 'putServiceEndpoint', `/service-endpoints/${name}`, {body});
    return this.api.put(`/service-endpoints/${name}`, {body});
  }

  getApiEndpoints = () => {
    console.log('EGADMIN CALL', 'getApiEndpoints', 'api-endpoints');
    return this.api.get('/api-endpoints');
  }

  deleteApiEndpoint = name => {
    console.log('EGADMIN CALL', 'deleteApiEndpoint', `/api-endpoints/${name}`);
    return this.api.delete(`/api-endpoints/${name}`);
  }

  putApiEndpoint = (name, body) => {
    console.log('EGADMIN CALL', 'putApiEndpoint', `/api-endpoints/${name}`, {body});
    return this.api.put(`/api-endpoints/${name}`, {body});
  }

  getPipelines = () => {
    console.log('EGADMIN CALL', 'getPipelines', '/pipelines');
    return this.api.get('/pipelines');
  }

  deletePipeline = name => {
    console.log('EGADMIN CALL', 'deletePipeline', `/pipelines/${name}`);
    return this.api.delete(`/pipelines/${name}`);
  }

  putPipeline = (name, body) => {
    console.log('EGADMIN CALL', 'putPipeline', `/pipelines/${name}`, {body});
    return this.api.put(`/pipelines/${name}`, {body});
  }

}

export default ExpressGatewayAdminService;
