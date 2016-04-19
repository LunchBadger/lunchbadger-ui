import BaseStore from 'stores/BaseStore';
import {register} from '../dispatcher/AppDispatcher';
import ModelProperty from 'models/ModelProperty';
import _ from 'lodash';

const Privates = [];

class Private extends BaseStore {
  constructor() {
    super();
    register((action) => {
      switch (action.type) {
        case 'AddPrivateEndpoint':
          Privates.push(action.endpoint);
          action.endpoint.top = this.getNewElementPosition(Privates);
          this.emitChange();
          break;

        case 'AddModel':
          Privates.push(action.model);
          action.model.top = this.getNewElementPosition(Privates);
          this.emitChange();
          break;

        case 'UpdatePrivateEndpoint':
          this.updateEntity(action.id, action.data);
          this.emitChange();
          break;

        case 'UpdateModel':
          this.updateEntity(action.id, action.data);
          this.emitChange();
          break;

        case 'AddModelProperty':
          action.model.addProperty(ModelProperty.create({propertyKey: action.key, propertyValue: action.value}));
          this.emitChange();
          break;
      }
    });
  }

  getData() {
    return Privates;
  }

  findEntity(id) {
    return _.find(Privates, {id: id});
  }
}

export default new Private;
