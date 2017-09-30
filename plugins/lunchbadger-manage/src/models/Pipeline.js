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
    }
  }

  toApiJSON() {
    const serviceEndpoints = Connections.search({toId: this.id}).map(conn => conn.fromId);
    const json = {
      name: this.id,
      friendlyName: this.name,
      policies: this.policies.map(policy => policy.toApiJSON(serviceEndpoints)),
      apiEndpoints: Connections.search({fromId: this.id}).map(conn => conn.toId),
    };
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
