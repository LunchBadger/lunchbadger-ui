import BaseModel from './BaseModel';
import Policy from './Policy';

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

  /**
   * @type {Policy[]}
   * @private
   */
  _policies = [];

  constructor(id, name) {
    super(id);

    this.name = name;
    this.policies = defaultPolicies;
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
}
