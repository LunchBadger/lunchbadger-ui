import {update, remove} from '../reduxActions/publicEndpoints';

const BaseModel = LunchBadgerCore.models.BaseModel;
const Port = LunchBadgerCore.models.Port;
const portGroups = LunchBadgerCore.constants.portGroups;

export default class PublicEndpoint extends BaseModel {
  static type = 'PublicEndpoint';
  _ports = [];
  wasBundled = false;
  path = '/endpoint';

  constructor(id, name) {
    super(id);
    this.name = name;
    this.ports = [
      Port.create({
        id: this.id,
        portGroup: portGroups.PUBLIC,
        portType: 'in'
      })
    ];
  }

  recreate() {
    return PublicEndpoint.create(this);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      path: this.path,
      itemOrder: this.itemOrder
    }
  }

  get ports() {
    return this._ports;
  }

  set ports(ports) {
    this._ports = ports;
  }

  validate(model) {
    return (_, getState) => {
      const validations = {data: {}};
      const entities = getState().entities.publicEndpoints;
      const {messages, checkFields} = LunchBadgerCore.utils;
      if (model.name !== '') {
        const isDuplicateName = Object.keys(entities)
          .filter(id => id !== this.id)
          .filter(id => entities[id].name.toLowerCase() === model.name.toLowerCase())
          .length > 0;
        if (isDuplicateName) {
          validations.data.name = messages.duplicatedEntityName('Public Endpoint');
        }
      }
      const fields = ['name', 'path'];
      checkFields(fields, model, validations.data);
      validations.isValid = Object.keys(validations.data).length === 0;
      return validations;
    }
  }

  update(model) {
    return async dispatch => await dispatch(update(this, model));
  }

  remove() {
    return async dispatch => await dispatch(remove(this));
  }

}
