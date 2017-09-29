import _ from 'lodash';
import {update, remove} from '../reduxActions/gateways';
import Pipeline from './Pipeline';
import HttpsTlsDomain from './HttpsTlsDomain';
import ExpressGatewayAdminService from '../services/ExpressGatewayAdminService';
import {gatewayPolicies} from '../utils/gatewayPolicies';

const BaseModel = LunchBadgerCore.models.BaseModel;

export default class Gateway extends BaseModel {
  static type = 'Gateway';
  static entities = 'gateways';

  /**
   * @type {Pipeline[]}
   * @private
   */
  _pipelines = [];

  _policies = gatewayPolicies;

  constructor(id, name) {
    super(id);
    this.name = name;
    this.adminApi = new ExpressGatewayAdminService();
    this.adminApi.initialize(id);
  }

  static create(data) {
    return super.create({
      ...data,
      pipelines: Object.keys(data.pipelines || {}).map(name => Pipeline.create({name, ...data.pipelines[name]})),
      http: this.deserializeHttp(data.http),
      https: this.deserializeHttps(data.https),
      admin: this.deserializeAdmin(data.admin),
    });
  }

  recreate() {
    return Gateway.create(this.toJSON());
  }

  toJSON() {
    const json = {
      id: this.id,
      name: this.name,
      dnsPrefix: 'gateway',
      policies: this.policies,
      pipelines: this.pipelines.map(item => item.toJSON()),
      itemOrder: this.itemOrder,
    };
    if (this.http.enabled) {
      json.http = {
        port: this.http.port,
      };
    }
    if (this.https.enabled) {
      json.https = {
        port: this.https.port,
        tls: this.https.tls.reduce((r, i) => ({...r, ...i.toJSON()}), {}),
      };
    }
    if (this.admin.enabled) {
      json.admin = {
        hostname: this.admin.hostname,
        port: this.admin.port,
      };
    }
    return json;
  }

  async onSave(state) {
    if (this.loaded) {
      const [gatewayServiceEndpoints, gatewayApiEndpoints, gatewayPipelines] = await Promise.all([
        this.adminApi.getServiceEndpoints(),
        this.adminApi.getApiEndpoints(),
        this.adminApi.getPipelines(),
      ]);
      for (let id in gatewayServiceEndpoints.body) {
        if (id === 'admin') continue;
        await this.adminApi.deleteServiceEndpoint(id);
      }
      for (let id in gatewayApiEndpoints.body) {
        if (id === 'admin') continue;
        await this.adminApi.deleteApiEndpoint(id);
      }
      const {entities: {serviceEndpoints, apiEndpoints}} = state;
      for (let id in serviceEndpoints) {
        await this.adminApi.putServiceEndpoint(id, serviceEndpoints[id].toApiJSON());
      }
      for (let id in apiEndpoints) {
        await this.adminApi.putApiEndpoint(id, apiEndpoints[id].toApiJSON());
      }
      for (let i = 0; i < gatewayPipelines.body.length; i += 1) {
        const pipeline = gatewayPipelines.body[i];
        if (pipeline.name === 'admin') continue;
        await this.adminApi.deletePipeline(pipeline.name);
      }
      for (let i = 0; i < this.pipelines.length; i += 1) {
        const pipeline = this.pipelines[i];
        await this.adminApi.putPipeline(pipeline.id, pipeline.toApiJSON());
      }
    }
  }

  static deserializeHttp(http) {
    let enabled = false;
    if (http) {
      if (typeof http.enabled === 'boolean') {
        enabled = http.enabled;
      } else {
        enabled = true;
      }
    }
    return {
      enabled,
      port: http ? http.port : '',
    };
  }

  static deserializeHttps(https) {
    let enabled = false;
    if (https) {
      if (typeof https.enabled === 'boolean') {
        enabled = https.enabled;
      } else {
        enabled = true;
      }
    }
    return {
      enabled,
      port: https ? https.port : '',
      tls: https ? Object.keys(https.tls).map(domain => HttpsTlsDomain.create({
        domain,
        key: https.tls[domain].key,
        cert: https.tls[domain].cert,
      })): [],
    };
  }

  static deserializeAdmin(admin) {
    let enabled = false;
    if (admin) {
      if (typeof admin.enabled === 'boolean') {
        enabled = admin.enabled;
      } else {
        enabled = true;
      }
    }
    return {
      enabled,
      hostname: admin ? admin.hostname : '',
      port: admin ? admin.port : '',
    };
  }

  /**
   * @param pipelines {Pipeline[]}
   */
  set pipelines(pipelines) {
    this._pipelines = pipelines;
  }

  /**
   * @returns {Pipeline[]}
   */
  get pipelines() {
    return this._pipelines;
  }

  set policies(policies) {
    this._policies = policies;
  }

  get policies() {
    return this._policies;
  }

  /**
   * @param pipeline {Pipeline}
   */
  addPipeline(pipeline) {
    this._pipelines.push(pipeline);
  }

  /**
   * @param pipeline {Pipeline}
   */
  removePipeline(pipeline) {
    _.remove(this._pipelines, function (_pipeline) {
      return _pipeline.id === pipeline.id
    });
  }

  validate(model) {
    return (_, getState) => {
      const validations = {data: {}};
      const entities = getState().entities.gateways;
      const {messages, checkFields} = LunchBadgerCore.utils;
      if (model.name !== '') {
        const isDuplicateName = Object.keys(entities)
          .filter(id => id !== this.id)
          .filter(id => entities[id].name.toLowerCase() === model.name.toLowerCase())
          .length > 0;
        if (isDuplicateName) {
          validations.data.name = messages.duplicatedEntityName('Gateway');
        }
      }
      const fields = ['name'];
      checkFields(fields, model, validations.data);
      validations.isValid = Object.keys(validations.data).length === 0;
      return validations;
    }
  }

  update(model) {
    return async dispatch => await dispatch(update(this, model));
  }

  remove() {
    return async dispatch => await dispatch(remove(this));
  }

  processModel(model) {
    const data = _.cloneDeep(model);
    data.https.tls = {};
    if (model.https.enabled) {
      (model.https.tls || []).forEach(({domain, key, cert}) => {
        if (domain.trim() === '') return;
        data.https.tls[domain.trim()] = {key, cert};
      });
    }
    data.pipelines = [];
    (model.pipelines || []).forEach(({id, name, policies}) => {
      if (name.trim() === '') return;
      const pipeline = {
        id,
        name: name.trim(),
        policies: [],
      };
      (policies || []).forEach(({id, name, pairs}) => {
        const policy = {
          id,
          [name]: [],
        };
        (pairs || []).forEach(({id, action, condition}) => {
          const pair = {
            id,
            action: {},
            condition: {},
          };
          (action || []).forEach((parameter) => {
            if (parameter.name.trim() !== '') {
              pair.action[parameter.name.trim()] = parameter.value;
            }
          });
          (condition || []).forEach((parameter) => {
            if (parameter.name.trim() !== '') {
              pair.condition[parameter.name] = parameter.value;
            }
          });
          policy[name].push(pair);
        });
        pipeline.policies.push(policy);
      });
      data.pipelines.push(pipeline);
    });
    return data;
  }

}
