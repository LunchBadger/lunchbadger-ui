import BaseModel from './BaseModel';

export default class ModelProperty extends BaseModel {
  static type = 'Policy';

  constructor(id, key, value) {
    super(id);

    this.propertyKey = key;
    this.propertyValue = value;

  }
}
