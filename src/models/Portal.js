import _ from 'lodash';
import API from './API';

const BaseModel = LunchBadgerCore.models.BaseModel;

export default class Portal extends BaseModel {
  static type = 'Portal';

  /**
   * @type {API[]}
   * @private
   */
  _apis = [];

	/**
   * @type {string}
   * @private
   */
  _rootUrl = '';

  _accept = [API.type];

  constructor(id, name, url = 'http://') {
    super(id);

    this.name = name;
    this.ready = false;
    this.rootUrl = url;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      apis: this.apis.map(api => api.toJSON()),
      rootUrl: this.rootUrl,
      itemOrder: this.itemOrder
    }
  }

  /**
   * @param apis {API[]}
   */
  set apis(apis) {
    this._apis = apis.map((api) => {
      api.wasBundled = true;
      return API.create(api);
    });
  }

  /**
   * @returns {API[]}
   */
  get apis() {
    return this._apis;
  }

  /**
   * @param api {API}
   */
  addAPI(api) {
    api.wasBundled = true;
    this._apis.push(api);
  }

  removeAPI(api) {
    this._apis.splice(_.findIndex(this.apis, {id: api.id}), 1);
  }

  get accept() {
    return this._accept;
  }

  get publicEndpoints() {
    return this._apis.reduce((endpoints, api) => endpoints.concat(api.publicEndpoints), []);
  }

  get rootUrl() {
    return this._rootUrl;
  }

  set rootUrl(url) {
    this._rootUrl = url;
  }
}
