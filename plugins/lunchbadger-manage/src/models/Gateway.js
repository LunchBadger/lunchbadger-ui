import _ from 'lodash';
import slug from 'slug';
import {update, remove} from '../reduxActions/gateways';
import Pipeline from './Pipeline';
import HttpsTlsDomain from './HttpsTlsDomain';
import ExpressGatewayAdminService from '../services/ExpressGatewayAdminService';
import {clearEmptyObjectPlaceholders} from '../utils';
import Config from '../../../../src/config';

const BaseModel = LunchBadgerCore.models.BaseModel;
const {Connections} = LunchBadgerCore.stores;
const {storeUtils: {findGatewayByPipelineId, isInPublicQuadrant}} = LunchBadgerCore.utils;
const {consumerManagement} = Config.get('features');

export default class Gateway extends BaseModel {
  static type = 'Gateway';
  static entities = 'gateways';

  /**
   * @type {Pipeline[]}
   * @private
   */
  _pipelines = [];
  _policies = [];
  system = {};
  zoomWindow = {
    width: 1150,
    height: 750,
  };

  running = true;
  deleting = null;
  fake = null;

  constructor(id, name) {
    super(id);
    this.name = name;
  }

  static create(data) {
    const adminApi = new ExpressGatewayAdminService(data.name);
    if (!data.deleting) {
      adminApi.initialize(data.name);
    }
    return super.create({
      ...data,
      pipelines: Object.keys(data.pipelines || {}).map(name => Pipeline.create({name, ...data.pipelines[name]})),
      http: this.deserializeHttp(data.http),
      https: this.deserializeHttps(data.https),
      admin: this.deserializeAdmin(data.admin),
      adminApi: adminApi,
    });
  }

  recreate() {
    return Gateway.create(this.toJSON());
  }

  toJSON(opts) {
    const options = Object.assign({
      isForServer: false,
      isForDiff: false,
    }, opts);
    const json = {
      id: this.id,
      name: this.name,
      dnsPrefix: 'gateway',
      policies: this.policies,
      pipelines: this.pipelines.map(item => item.toJSON()),
      itemOrder: this.itemOrder,
      system: this.system,
    };
    if (!options.isForServer) {
      Object.assign(json, {
        deleting: this.deleting,
        running: this.running,
        fake: this.fake,
      });
    }
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
    if (options.plain === this.id) {
      json.pipelines = [];
    }
    if (options.isForDiff) {
      if (this.running) {
        json.pipelines = this.pipelines.reduce((map, pipeline) => {
          map[pipeline.id] = pipeline;
          return map;
        }, {});
      } else {
        json.pipelines = {};
      }
    }
    return json;
  }

  toModelJSON() {
    return {
      admin: this.admin,
      http: this.http,
      https: this.https,
      name: this.name,
      pipelines: this.pipelines.map(item => item.toModelJSON()),
    };
  }

  get tabs() {
    const tabs = [
      {
        name: 'pipelines',
        label: 'Pipelines',
        icon: 'iconPipelines',
      },
    ];
    if (consumerManagement) {
      tabs.push({
        name: 'customerManagement',
        label: 'Consumer Management',
        icon: 'iconCustomerManagement',
      });
    }
    return tabs;
  }

  get status() {
    if (this.deleting) return 'deleting';
    if (this.loaded && this.running === null) return 'deploying';
    if (!this.running) return 'crashed';
    return '';
  }

  async onSave(state, delta, data, prevData) {
    if (this.loaded && this.running) {
      const endpointOperations = {};
      const pipelineOperations = {};
      const {entities} = state;
      const kinds = {
        apiEndpoints: 'ApiEndpoint',
        serviceEndpoints: 'ServiceEndpoint',
        models: 'ServiceEndpoint',
        functions: 'ServiceEndpoint',
      };
      for (let i in delta) {
        const {op, path} = delta[i];
        const [kind, id] = path;
        if (Object.keys(kinds).includes(kind)) {
          const isAdd = op === 'add' && path.length === 2;
          const isDelete = op === 'remove' && path.length === 2;
          const isRename = op === 'replace' && path.length === 3 && path[2] === 'name';
          const operation = `${isDelete ? 'delete' : 'put'}${kinds[kind]}`;
          const body = isDelete
            ? null
            : (entities[kind][id] || isInPublicQuadrant(state, id)).toApiJSON();
          let addOperation = true;
          if (kind === 'models' || kind === 'functions') {
            addOperation = false;
            if (isAdd || isDelete || isRename) {
              addOperation = true;
            }
          }
          if (addOperation) {
            endpointOperations[id] = {operation, body};
          }
        }
        if (kind === 'gateways' && path.length >= 4 && path[2] === 'pipelines') {
          const isDelete = op === 'remove' && path.length === 4;
          if (id === this.id) {
            const idPipeline = path[3];
            const operation = `${isDelete ? 'delete' : 'put'}Pipeline`;
            const pipelineIdx = entities.gateways[id].pipelines.findIndex(({id}) => id === idPipeline);
            const body = isDelete ? null : entities.gateways[id].pipelines[pipelineIdx].toApiJSON();
            pipelineOperations[idPipeline] = {operation, body};
          }
        }
        if (kind === 'connections' && path.length >= 2) {
          const connectionPrev = prevData.connections[id];
          if (connectionPrev) {
            const pipelineIdPrev = id;
            const gatewayPrev = findGatewayByPipelineId(state, pipelineIdPrev);
            if (gatewayPrev && gatewayPrev.id === this.id) {
              const pipelinePrev = entities.gateways[this.id].pipelines.find(({id}) => id === pipelineIdPrev);
              if (pipelinePrev) {
                const body = pipelinePrev.toApiJSON();
                pipelineOperations[pipelineIdPrev] = {operation: 'putPipeline', body};
              }
            }
          }
          const connectionCurr = data.connections[id];
          if (connectionCurr) {
            const pipelineIdCurr = id;
            const gatewayCurr = findGatewayByPipelineId(state, pipelineIdCurr);
            if (gatewayCurr && gatewayCurr.id === this.id) {
              const pipelineCurr = entities.gateways[this.id].pipelines.find(({id}) => id === pipelineIdCurr);
              if (pipelineCurr) {
                const body = pipelineCurr.toApiJSON();
                pipelineOperations[pipelineIdCurr] = {operation: 'putPipeline', body};
              }
            }
          }
        }
      }
      for (let id in endpointOperations) {
        const {operation, body} = endpointOperations[id];
        await this.adminApi[operation](id, body);
      }
      for (let id in pipelineOperations) {
        const {operation, body} = pipelineOperations[id];
        await this.adminApi[operation](id, body);
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

  get ports() {
    return this.pipelines
      .map(pipeline => pipeline.ports)
      .reduce((prev, curr) => [...prev, ...curr], []);
  }

  get rootUrl() {
    return Config.get('expressGatewayAccessApiUrl').replace('{NAME}', slug(this.name, {lower: true}));
  }

  getHighlightedPorts(selectedSubelementIds = []) {
    return this.pipelines
      .filter(pipeline => selectedSubelementIds.length === 0
        ? true
        : selectedSubelementIds.includes(pipeline.id)
      )
      .map(pipeline => pipeline.ports)
      .reduce((prev, curr) => [...prev, ...curr], []);
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

  beforeRemove(paper) {
    (this.pipelines || []).forEach(({id}) => {
      const connectionsTo = Connections.search({toId: id});
      const connectionsFrom = Connections.search({fromId: id});
      [...connectionsTo, ...connectionsFrom].map((conn) => {
        conn.info.source.classList.add('discardAutoSave');
        paper.detach(conn.info.connection);
      });
    });
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
        (pairs || []).forEach((pair) => {
          policy[name].push(clearEmptyObjectPlaceholders(pair));
        });
        pipeline.policies.push(policy);
      });
      data.pipelines.push(pipeline);
    });
    return data;
  }

}
