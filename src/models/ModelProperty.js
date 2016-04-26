import BaseModel from './BaseModel';

export default class ModelProperty extends BaseModel {
  static type = 'ModelProperty';

  constructor(id, key, value, type, isRequired, isIndex, notes) {
    super(id);

    this.propertyKey = key;
    this.propertyValue = value;
    this.propertyType = type;
    this.propertyIsRequired = isRequired;
    this.propertyIsIndex = isIndex;
    this.propertyNotes = notes;

  }
}
