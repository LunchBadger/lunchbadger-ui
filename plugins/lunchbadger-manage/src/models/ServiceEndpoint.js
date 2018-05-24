import _ from 'lodash';
import {update, remove} from '../reduxActions/serviceEndpoints';

const BaseModel = LunchBadgerCore.models.BaseModel;
const portGroups = LunchBadgerCore.constants.portGroups;
const Port = LunchBadgerCore.models.Port;
const {Connections} = LunchBadgerCore.stores;

export default class ServiceEndpoint extends BaseModel {
  static type = 'ServiceEndpoint';
  static entities = 'serviceEndpoints';

  _ports = [];
  urls = [];

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

  static create(data) {
    return super.create({
      ...data,
      urls: data.urls ? data.urls : [data.url],
    });
  }

  recreate() {
    return ServiceEndpoint.create(this.toJSON());
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      urls: this.urls,
      itemOrder: this.itemOrder
    };
  }

  toApiJSON() {
    return {
      friendlyName: this.name,
      urls: this.urls,
    };
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
      const fields = ['name'];
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

  beforeRemove(paper) {
    const connectionsFrom = Connections.search({fromId: this.id});
    connectionsFrom.map((conn) => {
      conn.info.connection.setParameter('discardAutoSave', true);
      paper.detach(conn.info.connection);
    });
  }

  processModel(model) {
    const data = _.cloneDeep(model);
    data.urls = [];
    model.urls.forEach((url) => {
      if (url.trim() === '') return;
      data.urls.push(url.trim());
    })
    return data;
  }
}
