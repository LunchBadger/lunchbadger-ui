import BaseModel from './BaseModel';

export default class Gateway extends BaseModel {
  type = 'Gateway';

  constructor(id, name) {
    super(id);

    this.name = name;
  }
}
