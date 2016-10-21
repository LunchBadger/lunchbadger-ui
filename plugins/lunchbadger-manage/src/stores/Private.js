import ModelProperty from '../models/ModelProperty';
import _ from 'lodash';

const BaseStore = LunchBadgerCore.stores.BaseStore;
const {register} = LunchBadgerCore.dispatcher.AppDispatcher;

let Privates = [];
let initCalls = 2;

class Private extends BaseStore {
  constructor() {
    super();
    register((action) => {
      switch (action.type) {
        case 'InitializePrivate':
          initCalls--;
          Privates.push.apply(Privates, action.data);

          Privates = this.sortItems(Privates);

          if (initCalls === 0) {
            this.emitInit();
          } else {
            this.emitChange();
          }

          break;
        case 'UpdatePrivateOrder':
          _.remove(Privates, action.entity);
          Privates.splice(action.hoverOrder, 0, action.entity);
          Privates = this.sortItems(this.setEntitiesOrder(Privates));
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
          action.model.addProperty(ModelProperty.create({
            name: action.attrs.key,
            default_: action.attrs.default_,
            type: action.attrs.type,
            required: action.attrs.required,
            index: action.attrs.index,
            description: action.attrs.description
          }));
          this.emitChange();
          break;

        case 'RemoveModelProperty':
          action.model.removeProperty(action.property);
          this.emitChange();
          break;

        case 'RemoveEntity':
          _.remove(Privates, {id: action.entity.id});
          this.emitChange();
          break;
      }
    });
  }

  getData() {
    return Privates;
  }

  findEntity(id) {
    id = this.formatId(id);

    return _.find(Privates, {id: id});
  }
}

export default new Private;
