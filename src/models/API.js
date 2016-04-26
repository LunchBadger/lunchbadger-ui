import BaseModel from './BaseModel';
import PublicEndpoint from './PublicEndpoint';
import _ from 'lodash';

export default class API extends BaseModel {
  static type = 'API';

  /**
   * @type {Endpoint[]}
   * @private
   */
  _endpoints = [];

  _accept = [PublicEndpoint.type];

  constructor(id, name) {
    super(id);

    this.name = name;

    this.addEndpoint(PublicEndpoint.create({
      name: 'Endpoint 1'
    }));
  }

  /**
   * @param endpoints {Endpoint[]}
   */
  set endpoints(endpoints) {
    this._endpoints = endpoints;
  }

  /**
   * @returns {Endpoint[]}
   */
  get endpoints() {
    return this._endpoints;
  }

  /**
   * @param endpoint {Endpoint}
   */
  addEndpoint(endpoint) {
    this._endpoints.push(endpoint);
  }

  removeEndpoint(endpoint) {
    this._endpoints.splice(_.findIndex(this.endpoints, {id: endpoint.id}), 1);
  }

  get accept() {
    return this._accept;
  }
}
