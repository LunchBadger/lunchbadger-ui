const BaseModel = LunchBadgerCore.models.BaseModel;

export default class Metric extends BaseModel {
  static type = 'Metric';

  /**
   * @type {any}
   * @private
   */
  _entity = null;

  constructor(id, entity, left, top) {
    super(id);

    this.entity = entity;
    this.left = left;
    this.top = top;
  }

  get entity() {
    return this._entity;
  }

  set entity(entity) {
    this._entity = entity;
  }
}
