import _ from 'lodash';
import {update, remove} from '../reduxActions/apis';
import APIPlan from './APIPlan';

const ApiEndpoint = LunchBadgerManage.models.ApiEndpoint;
const BaseModel = LunchBadgerCore.models.BaseModel;

export default class API extends BaseModel {
  static type = 'API';
  static entities = 'apis';

  /**
   * @type {Endpoint[]}
   * @private
   */
  _apiEndpoints = [];

  /**
   * @type {APIPlan[]}
   * @private
   */
  _plans = [];

  _accept = [ApiEndpoint.type];

  constructor(id, name) {
    super(id);
    const defaultPlans = [
      APIPlan.create({name: 'Free', icon: 'fa-paper-plane'}),
      APIPlan.create({name: 'Developer', icon: 'fa-plane'}),
      APIPlan.create({name: 'Professional', icon: 'fa-fighter-jet'})
    ];
    this.name = name;
    this.plans = defaultPlans.slice();
  }

  recreate() {
    return API.create(this);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      apiEndpoints: this.apiEndpoints.map(endpoint => endpoint.toJSON()),
      plans: this.plans.map(plan => plan.toJSON()),
      itemOrder: this.itemOrder,
      portalId: this.portalId
    }
  }

  /**
   * @param endpoints {Endpoint[]}
   */
  set apiEndpoints(endpoints) {
    this._apiEndpoints = endpoints.map((endpoint) => {
      endpoint.wasBundled = true;
      return ApiEndpoint.create(endpoint);
    });
  }

  /**
   * @returns {Endpoint[]}
   */
  get apiEndpoints() {
    return this._apiEndpoints;
  }

  /**
   * @param plans {APIPlan[]}
   */
  set plans(plans) {
    this._plans = plans.map((plan) => {
      return APIPlan.create(plan);
    });
  }

  /**
   * @returns {APIPlan[]}
   */
  get plans() {
    return this._plans;
  }

  /**
   * @param endpoint {Endpoint}
   */
  addEndpoint(endpoint) {
    endpoint.wasBundled = true;
    this._apiEndpoints.push(endpoint);
  }

  removeEndpoint(endpoint) {
    this._apiEndpoints.splice(_.findIndex(this.apiEndpoints, {id: endpoint.id}), 1);
  }

  /**
   * @param plan {APIPlan}
   */
  addPlan(plan) {
    this._plans.push(plan);
  }

  /**
   * @param plan {APIPlan}
   */
  removePlan(plan) {
    this._plans.splice(_.findIndex(this.plans, {id: plan.id}), 1);
  }

  get accept() {
    return this._accept;
  }

  validate(model) {
    return (_, getState) => {
      const validations = {data: {}};
      const entities = getState().entities.apis;
      const {messages, checkFields} = LunchBadgerCore.utils;
      if (model.name !== '') {
        const isDuplicateName = Object.keys(entities)
          .filter(id => id !== this.id)
          .filter(id => entities[id].name.toLowerCase() === model.name.toLowerCase())
          .length > 0;
        if (isDuplicateName) {
          validations.data.name = messages.duplicatedEntityName('API');
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
}
