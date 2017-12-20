import slug from 'slug';
import Config from '../../../../src/config';

const {ApiClient, getUser} = LunchBadgerCore.utils;

class ExpressGatewayAdminService {
  initialize = name => this.api = new ApiClient(Config.get('expressGatewayAdminApiUrl').replace('{NAME}', slug(name, {lower: true})), getUser().id_token);

  // getProjectId = () => `${getUser().profile.sub}-${Config.get('envId')}`;

  getServiceEndpoints = () => {
    console.log('EGADMIN CALL', 'getServiceEndpoints', `${this.api.url}/service-endpoints`);
    return this.api.get('/service-endpoints');
  }

  deleteServiceEndpoint = name => {
    console.log('EGADMIN CALL', 'deleteServiceEndpoint', `${this.api.url}/service-endpoints/${name}`);
    return this.api.delete(`/service-endpoints/${name}`);
  }

  putServiceEndpoint = (name, body) => {
    console.log('EGADMIN CALL', 'putServiceEndpoint', `${this.api.url}/service-endpoints/${name}`, {body});
    return this.api.put(`/service-endpoints/${name}`, {body});
  }

  getApiEndpoints = () => {
    console.log('EGADMIN CALL', 'getApiEndpoints', `${this.api.url}/api-endpoints`);
    return this.api.get('/api-endpoints');
  }

  deleteApiEndpoint = name => {
    console.log('EGADMIN CALL', 'deleteApiEndpoint', `${this.api.url}/api-endpoints/${name}`);
    return this.api.delete(`/api-endpoints/${name}`);
  }

  putApiEndpoint = (name, body) => {
    console.log('EGADMIN CALL', 'putApiEndpoint', `${this.api.url}/api-endpoints/${name}`, {body});
    return this.api.put(`/api-endpoints/${name}`, {body});
  }

  getPipelines = () => {
    console.log('EGADMIN CALL', 'getPipelines', `${this.api.url}/pipelines`);
    return this.api.get('/pipelines');
  }

  deletePipeline = name => {
    console.log('EGADMIN CALL', 'deletePipeline', `${this.api.url}/pipelines/${name}`);
    return this.api.delete(`/pipelines/${name}`);
  }

  putPipeline = (name, body) => {
    console.log('EGADMIN CALL', 'putPipeline', `${this.api.url}/pipelines/${name}`, {body});
    return this.api.put(`/pipelines/${name}`, {body});
  }

}

export default ExpressGatewayAdminService;
