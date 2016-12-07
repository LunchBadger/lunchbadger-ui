import ModelProperty from '../models/ModelProperty';
import _ from 'lodash';

const BaseStore = LunchBadgerCore.stores.BaseStore;
const {register} = LunchBadgerCore.dispatcher.AppDispatcher;

let Privates = [];

class Private extends BaseStore {
  constructor() {
    super(2);
    register((action) => {
      this.handleBaseActions('Private', ['Model', 'PrivateEndpoint'], action);

      switch (action.type) {
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

        case 'ClearData':
          Privates = [];
          this.emitChange();
          break;
      }
    });
  }

  getData() {
    return Privates;
  }

  setData(data) {
    Privates = data;
  }

  findEntity(id) {
    id = this.formatId(id);

    return _.find(Privates, {id: id});
  }
}

export default new Private;
