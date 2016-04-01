import BaseModel from './BaseModel';

export default class PublicEndpoint extends BaseModel {
  type = 'PublicEndpoint';

  constructor(id, name) {
    super(id);

    this.name = name;
  }
}
