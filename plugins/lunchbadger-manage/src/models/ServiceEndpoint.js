import {update, remove} from '../reduxActions/serviceEndpoints';

const BaseModel = LunchBadgerCore.models.BaseModel;
const portGroups = LunchBadgerCore.constants.portGroups;
const Port = LunchBadgerCore.models.Port;

export default class ServiceEndpoint extends BaseModel {
  static type = 'ServiceEndpoint';
  static entities = 'serviceEndpoints';

  _ports = [];
  url = 'https://service/endpoint';

  constructor(id, name) {
    super(id);
    this.name = name;
    this.ports = [
      Port.create({
        id: this.id,
        portGroup: portGroups.GATEWAYS,
        portType: 'out'
      })
    ];
  }

  recreate() {
    return ServiceEndpoint.create(this);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      url: this.url,
      contextPath: this.contextPath,
      itemOrder: this.itemOrder
    }
  }

  get ports() {
    return this._ports;
  }

  set ports(ports) {
    this._ports = ports;
  }

  // The default/initial REST path to be used when auto-creating an api
  // endpoint associated with this.
  get contextPath() {
    return this.name.toLowerCase().replace(/ /g, '-');
  }

  set contextPath(_) {}

  validate(model) {
    return (_, getState) => {
      const validations = {data: {}};
      const entities = getState().entities.serviceEndpoints;
      const {messages, checkFields} = LunchBadgerCore.utils;
      if (model.name !== '') {
        const isDuplicateName = Object.keys(entities)
          .filter(id => id !== this.id)
          .filter(id => entities[id].name.toLowerCase() === model.name.toLowerCase())
          .length > 0;
        if (isDuplicateName) {
          validations.data.name = messages.duplicatedEntityName('Service Endpoint');
        }
      }
      const fields = ['name', 'url'];
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
