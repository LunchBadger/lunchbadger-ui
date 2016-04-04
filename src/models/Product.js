import BaseModel from './BaseModel';
import PublicEndpoint from './PublicEndpoint';

const endpoint = PublicEndpoint.create({
  name: 'Endpoint 1'
});

export default class Product extends BaseModel {
  type = 'Product';

  /**
   * @type {Endpoint[]}
   * @private
   */
  _endpoints = [];

  constructor(id, name) {
    super(id);

    this.name = name;
    this.addEndpoint(endpoint);
  }

  /**
   * @param endpoints {Enpoint[]}
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
}
