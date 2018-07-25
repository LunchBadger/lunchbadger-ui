import _ from 'lodash';
import {update, remove} from '../reduxActions/functions';
import {validFunctionName} from '../utils';
import Config from '../../../../src/config';

const {BaseModel, Port} = LunchBadgerCore.models;
const portGroups = LunchBadgerCore.constants.portGroups;
const {Connections} = LunchBadgerCore.stores;
const {coreActions} = LunchBadgerCore.utils;

export default class Function_ extends BaseModel {
  static type = 'Function_';
  static friendlyName = 'Function';
  static entities = 'functions';

  _ports = [];
  slugifyName = true;
  service = null;
  running = true;
  allowEditWhenCrashed = true;
  isCanvasEditDisabled = true;
  zoomWindow = {
    width: 1004,
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
      if (!validFunctionName(model.name)) validations.data.name = 'It must be a valid JavaScript function name';
      validations.isValid = Object.keys(validations.data).length === 0;
      return validations;
    }
  }

  update(model) {
    return async dispatch => await dispatch(update(this, model));
  }

  remove(cb) {
    return async dispatch => await dispatch(remove(this, cb));
  }

  beforeRemove(paper) {
    const connectionsTo = Connections.search({toId: this.id});
    const connectionsFrom = Connections.search({fromId: this.id});
    let isAutoSave = false;
    [...connectionsTo, ...connectionsFrom].map((conn) => {
      isAutoSave = true;
      conn.info.source.classList.add('discardAutoSave');
      paper.detach(conn.info.connection);
    });
    if (isAutoSave) {
      return coreActions.saveToServer;
    }
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
