const BaseModel = LunchBadgerCore.models.BaseModel;

export default class ModelProperty extends BaseModel {
  static type = 'ModelProperty';

  /**
   * @type {string}
   */
  propertyKey = '';

  /**
   * @type {string}
   */
  propertyValue = '';

  /**
   * @type {string}
   */
  propertyType = '';

  /**
   * @type {boolean}
   */
  propertyIsRequired = false;

  /**
   * @type {boolean}
   */
  propertyIsIndex = false;

  /**
   * @type {string}
   */
  propertyNotes = '';

  constructor(id, key = '', value = '', type = '', isRequired = false, isIndex = false, notes = '') {
    super(id);

    this.propertyKey = key;
    this.propertyValue = value;
    this.propertyType = type;
    this.propertyIsRequired = isRequired;
    this.propertyIsIndex = isIndex;
    this.propertyNotes = notes;
  }
}
