import BaseModel from './BaseModel';

export default class DataSource extends BaseModel {
  type = 'BaseModel';

  constructor(id, name) {
    super(id);

    this.name = name;
  }
}
