import BaseModel from './BaseModel';

export default class Port extends BaseModel {
  type = 'Port';

  constructor(id) {
    super(id);
  }
}
