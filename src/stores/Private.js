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
        case 'UpdatePrivateOrder':
          Privates.splice(action.itemOrder, 0, Privates.splice(action.hoverOrder, 1)[0]);
          this.setEntitiesOrder(Privates);
          this.emitChange();
          break;
        case 'AddPrivateEndpoint':
          Privates.push(action.endpoint);
          action.endpoint.itemOrder = Privates.length - 1;
          this.emitChange();
          break;

        case 'AddModel':
          Privates.push(action.model);
          action.model.itemOrder = Privates.length - 1;
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
