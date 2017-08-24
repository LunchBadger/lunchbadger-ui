import _ from 'lodash';
import Model from './Model';
import {update, remove} from '../reduxActions/microservices';

const BaseModel = LunchBadgerCore.models.BaseModel;

export default class Microservice extends BaseModel {
  static type = 'Microservice';

  /**
   * @type {Model.lunchbadgerId[]}
   * @private
   */
  _models = [];
  _accept = [Model.type];

  constructor(id, name) {
    super(id);
    this.name = name;
  }

  recreate() {
    return Microservice.create(this);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      models: this.models,
      itemOrder: this.itemOrder
    }
  }

  /**
   * @param models {Model.lunchbadgerId[]}
   */
  set models(models) {
    this._models = models;
  }

  /**
   * @returns {Model.lunchbadgerId[]}
   */
  get models() {
    return this._models;
  }

  /**
   * @param model {Model}
   */
  addModel(model) {
    this._models.push(model.lunchbadgerId || model.id);
  }

  /**
   * @param model {Model}
   */
  removeModel(model) {
    _.remove(this.models, (modelId) => modelId === (model.lunchbadgerId || model.id));
  }

  get accept() {
    return this._accept;
  }

  validate(model) {
    return (dispatch, getState) => {
      const validations = {data: {}};
      const {microservices, modelsBundled} = getState().entities;
      const {messages, checkFields} = LunchBadgerCore.utils;
      if (model.name !== '') {
        const isDuplicateName = Object.keys(microservices)
          .filter(id => id !== this.id)
          .filter(id => microservices[id].name.toLowerCase() === model.name.toLowerCase())
          .length > 0;
        if (isDuplicateName) {
          validations.data.name = messages.duplicatedEntityName('Microservice');
        }
      }
      const fields = ['name'];
      checkFields(fields, model, validations.data);
      const microserviceModels = this.models.map((id, idx) => ({
        entity: modelsBundled[id],
        model: model.models[idx],
      }));
      microserviceModels.forEach(({entity, model}) => {
        const modelValidations = dispatch(entity.validate(model));
        if (!modelValidations.isValid) {
          if (!validations.data.models) {
            validations.data.models = {};
          }
          validations.data.models[entity.id] = modelValidations.data;
        }
      });
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
