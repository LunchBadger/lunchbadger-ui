import BaseModel from './BaseModel';
import Policy from './Policy';
import Port from './Port';
import portGroups from '../constants/portGroups';

const defaultPolicies = [
  Policy.create({
    name: 'Auth 01'
  }),
  Policy.create({
    name: 'Rate limiter'
  }),
  Policy.create({
    name: 'Reverse Proxy'
  })
];

export default class Pipeline extends BaseModel {
  type = 'Pipeline';
  _ports = [];

  /**
   * @type {Policy[]}
   * @private
   */
  _policies = [];

  constructor(id, name) {
    super(id);

    this.name = name;
    this.policies = defaultPolicies;

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
