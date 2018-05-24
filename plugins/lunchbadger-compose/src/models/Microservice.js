import _ from 'lodash';
import Model from './Model';
import {update, remove} from '../reduxActions/microservices';

const BaseModel = LunchBadgerCore.models.BaseModel;
const {Connections} = LunchBadgerCore.stores;

export default class Microservice extends BaseModel {
  static type = 'Microservice';
  static entities = 'microservices';
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

  get isZoomDisabled() {
    return true;
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

  get ports() {
    return this.models.map(id => ({id}));
  }

  getHighlightedPorts(selectedSubelementIds = []) {
    return this.models
      .filter(id => selectedSubelementIds.length === 0
        ? true
        : selectedSubelementIds.includes(id)
      )
      .map(id => ({id}))
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
      const microserviceModels = model.models.map((item) => ({
        entity: modelsBundled[item.lunchbadgerId],
        item,
      }));
      microserviceModels.forEach(({entity, item}) => {
        const modelValidations = dispatch(entity.validate(item));
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

  beforeRemove(paper) {
    let connectionsFrom = [];
    this.models.forEach((fromId) => {
      connectionsFrom = [
        ...connectionsFrom,
        ...Connections.search({fromId}),
      ];
    });
    connectionsFrom.map((conn) => {
      conn.info.connection.setParameter('discardAutoSave', true);
      paper.detach(conn.info.connection);
    });
  }

}
