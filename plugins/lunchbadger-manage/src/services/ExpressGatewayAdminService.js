import Config from '../../../../src/config';

const {ApiClient, getUser} = LunchBadgerCore.utils;

class ExpressGatewayAdminService {
  initialize = name => this.api = new ApiClient(Config.get('expressGatewayAdminApiUrl')
    .replace('{NAME}', name), getUser().id_token);

  getServiceEndpoints = () => this.api.get('/service-endpoints');

  deleteServiceEndpoint = name => this.api.delete(`/service-endpoints/${name}`);

  putServiceEndpoint = (name, body) => this.api.put(`/service-endpoints/${name}`, {body});

  getApiEndpoints = () => this.api.get('/api-endpoints');

  deleteApiEndpoint = name => this.api.delete(`/api-endpoints/${name}`);

  putApiEndpoint = (name, body) => this.api.put(`/api-endpoints/${name}`, {body});

  getPipelines = () => this.api.get('/pipelines');

  deletePipeline = name => this.api.delete(`/pipelines/${name}`);

  putPipeline = (name, body) => this.api.put(`/pipelines/${name}`, {body});

  getUsers = start => this.api.get(`/users?start=${start}`);

  createUser = body => this.api.post('/users', {body});

  updateUser = (username, body) => this.api.put(`/users/${username}`, {body});

  removeUser = username => this.api.delete(`/users/${username}`);

  setUserStatus = (username, status) => this.api.put(`/users/${username}/status`, {body: {status}});

  getApps = start => this.api.get(`/apps?start=${start}`);

  createApp = body => this.api.post('/apps', {body});

  updateApp = (id, body) => this.api.put(`/apps/${id}`, {body});

  removeApp = id => this.api.delete(`/apps/${id}`);

  setAppStatus = (id, status) => this.api.put(`/apps/${id}/status`, {body: {status}});

  getAllCredentials = () => this.api.get('/credentials');

  getCredentials = consumerId => this.api.get(`/credentials/${consumerId}`);

  createCredentials = body => this.api.post('/credentials', {body});

  setCredentialsStatus = (type, credentialId, status) =>
    this.api.put(`/credentials/${type}/${credentialId}/status`, {body: {status}});

  setCredentialsScopes = (type, credentialId, scopes) =>
    this.api.put(`/credentials/${type}/${credentialId}/scopes`, {body: {scopes}});

  getScopes = () => this.api.get('/scopes');

  createScopes = scopes => this.api.post('/scopes', {body: {scopes}});

  createScope = scope => this.api.post(`/scopes/${scope}`);

  removeScope = scope => this.api.delete(`/scopes/${scope}`);

}

export default ExpressGatewayAdminService;
