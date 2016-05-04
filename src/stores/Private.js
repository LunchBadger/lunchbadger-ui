import ModelProperty from 'models/ModelProperty';
import _ from 'lodash';

const {BaseStore} = LBCore.stores;
const {register} = LBCore.dispatcher.AppDispatcher;
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
          action.model.addProperty(ModelProperty.create({
            propertyKey: action.attrs.key,
            propertyValue: action.attrs.value,
            propertyType: action.attrs.type,
            propertyIsRequired: action.attrs.isRequired,
            propertyIsIndex: action.attrs.isIndex,
            propertyNotes: action.attrs.notes
          }));
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
