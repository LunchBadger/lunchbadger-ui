import BaseModel from './BaseModel';

export default class Model extends BaseModel {
  type = 'Model';

  constructor(id, name) {
    super(id);

    this.name = name;
  }
}
