const BaseModel = LunchBadgerCore.models.BaseModel;

export default class ModelRelation extends BaseModel {
  static type = 'ModelRelation';

  /**
   * @type {string}
   */
  relationType = '';

  /**
   * @type {string}
   */
  relationForeignKey = '';

  /**
   * @type {string}
   */
  relationModel = '';

  constructor(id, foreignKey='', type = '', model='') {
    super(id);
    this.relationType = foreignKey;
    this.relationForeignKey = model;
    this.relationModel = type;
  }

  toJSON() {
    return {
      id: this.id,
      relationType: this.relationType,
      relationForeignKey: this.relationForeignKey,
      relationModel: this.relationModel
    }
  }
}
