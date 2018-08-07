import Policy from './Policy';

const BaseModel = LunchBadgerCore.models.BaseModel;
const portGroups = LunchBadgerCore.constants.portGroups;
const Port = LunchBadgerCore.models.Port;
const {Connections} = LunchBadgerCore.stores;

export default class Pipeline extends BaseModel {
  static type = 'Pipeline';
  _ports = [];

  /**
   * @type {Policy[]}
   * @private
   */
  _policies = [];

  constructor(id, name) {
    super(id);
    this.name = name;
    this.ports = [
      Port.create({
        id: this.id,
        portGroup: portGroups.GATEWAYS,
        portType: 'in'
      }),
      Port.create({
        id: this.id,
        portGroup: portGroups.PUBLIC,
        portType: 'out'
      })
    ];
  }

  static create(data) {
    return super.create({
      ...data,
      policies: (data.policies || []).map(policy => Policy.create(policy)),
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      policies: this.policies.map(policy => policy.toJSON()),
    };
  }

  toModelJSON() {
    return {
      id: this.id,
      name: this.name,
      policies: this.policies.map(policy => policy.toModelJSON()),
    };
  }

  toApiJSON(opts) {
    const options = Object.assign({
      isForDiff: false,
      connections,
    }, opts);
    const {isForDiff, connections} = options;
    const apiEndpoints = Connections
      .search({fromId: this.id})
      .filter(({info}) => {
        const wip = !info.connection || info.connection.hasType('wip');
        return !wip;
      })
      .map(conn => conn.toId);
    const json = {
      friendlyName: this.name,
      policies: this.policies.map(policy => policy.toApiJSON()),
      apiEndpoints: apiEndpoints.length > 0 ? apiEndpoints : undefined,
    };
    if (isForDiff) {
      if (json.apiEndpoints) {
        json.apiEndpoints = json.apiEndpoints.reduce((map, id) => {
          map[id] = true;
          return map;
        }, {});
      } else if (connections) {
        json.apiEndpoints = connections[this.id];
      }
      json.apiEndpoints = json.apiEndpoints || {};
    }
    return json;
  }

  /**
   * @param policies {Policy[]}
   */
  set policies(policies) {
    this._policies = policies;
  }

  /**
   * @returns {Policy[]}
   */
  get policies() {
    return this._policies;
  }

  /**
   * @param policy {Policy}
   */
  addPolicy(policy) {
    this._policies.push(policy);
  }

  get ports() {
    return this._ports;
  }

  set ports(ports) {
    this._ports = ports;
  }
}
