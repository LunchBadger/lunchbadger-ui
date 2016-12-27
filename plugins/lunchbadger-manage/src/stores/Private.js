import ModelProperty from '../models/ModelProperty';
import _ from 'lodash';

const BaseStore = LunchBadgerCore.stores.BaseStore;
const {register} = LunchBadgerCore.dispatcher.AppDispatcher;

let Privates = [];

class Private extends BaseStore {
  constructor() {
    super(2);
    register((action) => {
      this.handleBaseActions('Private', ['Model', 'Microservice', 'PrivateEndpoint'], action);

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

        case 'BundleMicroserviceStart':
          action.microservice.ready = false;
          this.emitChange();
          break;

        case 'BundleMicroserviceFinish':
          action.microservice.addModel(action.model);
          action.microservice.ready = true;
          this.emitChange();
          break;

        case 'UnbundleMicroserviceStart':
          action.microservice.ready = false;
          this.emitChange();
          break;

        case 'UnbundleMicroserviceFinish':
          action.microservice.removeModel(action.model);
          action.microservice.ready = true;
          this.emitChange();
          break;

        case 'RebundleMicroservice':
          action.fromMicroservice.removeModel(action.model);
          action.toMicroservice.addModel(action.model);
          this.emitChange();
          break;
      }
    });
  }

  getData(omitFilter = false) {
    if (omitFilter) {
      return Privates;
    }

    return Privates.filter((entity) => typeof entity.wasBundled === 'undefined' || entity.wasBundled === false);
  }

  setData(data) {
    Privates = data;
  }

  findEntity(id) {
    id = this.formatId(id);

    return _.find(Privates, {id: id}) || _.find(Privates, {lunchbadgerId: id});
  }
}

export default new Private;
