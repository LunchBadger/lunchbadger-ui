import _ from 'lodash';
import {update, remove} from '../reduxActions/portals';
import API from './API';

const BaseModel = LunchBadgerCore.models.BaseModel;

export default class Portal extends BaseModel {
  static type = 'Portal';
  static entities = 'portals';

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
    this.rootUrl = url;
  }

  recreate() {
    return Portal.create(this);
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

  validate(model) {
    return (_, getState) => {
      const validations = {data: {}};
      const entities = getState().entities.portals;
      const {messages, checkFields} = LunchBadgerCore.utils;
      if (model.name !== '') {
        const isDuplicateName = Object.keys(entities)
          .filter(id => id !== this.id)
          .filter(id => entities[id].name.toLowerCase() === model.name.toLowerCase())
          .length > 0;
        if (isDuplicateName) {
          validations.data.name = messages.duplicatedEntityName('Portal');
        }
      }
      const fields = ['name', 'rootUrl'];
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
}
