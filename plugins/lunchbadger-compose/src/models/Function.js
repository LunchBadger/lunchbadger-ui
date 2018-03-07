import _ from 'lodash';
import {update, remove} from '../reduxActions/functions';
import Config from '../../../../src/config';

const BaseModel = LunchBadgerCore.models.BaseModel;
const Port = LunchBadgerCore.models.Port;
const portGroups = LunchBadgerCore.constants.portGroups;

export default class Function_ extends BaseModel {
  static type = 'Function_';
  static entities = 'functions';

  _ports = [];
  slugifyName = true;
  service = null;
  running = true;
  isCanvasEditDisabled = true;

  constructor(id, name) {
    super(id);
    this.name = name;
    this.ports = [
      Port.create({
        id: this.id,
        portGroup: portGroups.PRIVATE,
        portType: 'in'
      }),
      Port.create({
        id: this.id,
        portGroup: portGroups.GATEWAYS,
        portType: 'out'
      })
    ];
  }

  recreate() {
    return Function_.create(this);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      itemOrder: this.itemOrder,
      service: this.service,
    }
  }

  toApiJSON() {
    return {
      friendlyName: this.name,
      url: Config.get('slsUrl').replace('{FN}', this.name),
    };
  }

  get status() {
    if (this.deleting) return 'deleting';
    if (this.loaded && this.running === null) return 'deploying';
    if (!this.running) return 'crashed';
    return '';
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
      const {functions} = getState().entities;
      const {messages, checkFields} = LunchBadgerCore.utils;
      if (model.name !== '') {
        const isDuplicateFunctionName = Object.keys(functions)
          .filter(id => id !== this.id)
          .filter(id => functions[id].name.toLowerCase() === model.name.toLowerCase())
          .length > 0;
        if (isDuplicateFunctionName) {
          validations.data.name = messages.duplicatedEntityName('Function');
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

  processModel(model) {
    const data = _.cloneDeep(model);
    data.service = Object.assign({}, this.service);
    if (data.hasOwnProperty('files')) {
      data.service.files = {};
      Object.keys(data.files || {}).forEach((key) => {
        data.service.files[key.replace(/\*/g, '.')] = data.files[key];
      });
      delete data.files;
    }
    return data;
  }

}
