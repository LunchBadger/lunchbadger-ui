import BaseModel from './BaseModel';

export default class DataSource extends BaseModel {
  type = 'DataSource';

  constructor(id, name) {
    super(id);

    this.name = name;
  }
}
