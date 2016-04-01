import BaseModel from './BaseModel';

export default class Policy extends BaseModel {
  type = 'Policy';

  constructor(id, name) {
    super(id);

    this.name = name;
  }
}
