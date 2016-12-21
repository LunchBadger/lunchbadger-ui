import _ from 'lodash';

const Model = LunchBadgerManage.models.Model;
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
    this.ready = false;
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
    model.wasBundled = true;
    this._models.push(model.lunchbadgerId || model.id);
  }

  /**
   * @param model {Model}
   */
  removeModel(model) {
    _.remove(this.models, (modelId) => modelId === model.lunchbadgerId);
  }

  get accept() {
    return this._accept;
  }
}
