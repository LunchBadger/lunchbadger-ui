import BaseModel from './BaseModel';

export default class PrivateEndpoint extends BaseModel {
  type = 'PrivateEndpoint';

  constructor(id, name) {
    super(id);

    this.name = name;
  }
}
