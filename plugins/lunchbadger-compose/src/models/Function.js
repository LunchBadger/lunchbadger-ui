import _ from 'lodash';
import {update, remove} from '../reduxActions/functions';
import {
  validFunctionName,
  javascriptReservedWords,
  pythonReservedWords,
  runtimeMapping,
} from '../utils';
import Config from '../../../../src/config';

const BaseModel = LunchBadgerCore.models.BaseModel;
const Port = LunchBadgerCore.models.Port;
const portGroups = LunchBadgerCore.constants.portGroups;
const {Connections} = LunchBadgerCore.stores;

export default class Function_ extends BaseModel {
  static type = 'Function_';
  static friendlyName = 'Function';
  static entities = 'functions';

  _ports = [];
  slugifyName = true;
  service = null;
  running = true;
  isCanvasEditDisabled = true;
  zoomWindow = {
    width: 1005,
    height: 750,
  };

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
      const {name, runtime} = model;
      if (name !== '') {
        const isDuplicateFunctionName = Object.keys(functions)
          .filter(id => id !== this.id)
          .filter(id => functions[id].name.toLowerCase() === name.toLowerCase())
          .length > 0;
        if (isDuplicateFunctionName) {
          validations.data.name = messages.duplicatedEntityName('Function');
        }
      }
      const fields = ['name'];
      checkFields(fields, model, validations.data);
      const isNameAlphanumerical = validFunctionName(name);
      const {language, reservedWords} = runtimeMapping(runtime, true).data;
      const isReservedWord = reservedWords.includes(name);
      if (!isNameAlphanumerical || isReservedWord) validations.data.name = `It must be a valid ${language} function name`;
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
    data.service = Object.assign({}, this.service);
    if (data.hasOwnProperty('files')) {
      data.service.files = {};
      this.processTree(data.files, data.service.files);
      delete data.files;
    }
    if (this.service && this.service.files) {
      this.markFilesToDelete(data.service.files, this.service.files);
    }
    return data;
  }

  processTree(tree, data) {
    Object.keys(tree).forEach((key) => {
      const f = key.replace(/\*/g, '.');
      data[f] = tree[key];
      if (f !== key) {
        delete data[key];
      }
      if (typeof data[f] === 'object') {
        this.processTree(tree[key], data[f]);
      } else if (data[f] === true) {
        data[f] = {};
      }
    });
  }

  markFilesToDelete(nextFiles, prevFiles) {
    Object.keys(prevFiles).forEach((name) => {
      if (!nextFiles.hasOwnProperty(name)) {
        nextFiles[name] = null;
      } else {
        if (typeof prevFiles[name] === 'object') {
          this.markFilesToDelete(nextFiles[name], prevFiles[name]);
        }
      }
    });
  }

}
