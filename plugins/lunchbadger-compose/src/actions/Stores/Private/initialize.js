import Microservice from '../../../models/Microservice';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
const Model = LunchBadgerManage.models.Model;
const ModelProperty = LunchBadgerManage.models.ModelProperty;
const ModelRelation = LunchBadgerManage.models.ModelRelation;

export default (privateModels, data) => {
  const microServices = data.microServices;
  const privateModelObjects = privateModels.map((privateModel, index) => {
    // remove properties before de-serializing data but first save it somewhere
    const embeddedProperties = privateModel.properties || [];
    const embeddedRelations = privateModel.relations || [];
    delete privateModel.properties;
    delete privateModel.relations;

    const model = Model.create({
      itemOrder: index,
      loaded: true,
      ...privateModel
    });

    embeddedProperties.forEach((property) => {
      model.addProperty(ModelProperty.create(property));
    });

    embeddedRelations.forEach((relation) => {
      model.addRelation(ModelRelation.create(relation));
    });

    return model;
  });

  const microServiceObjects = microServices.map((microService, index) => {
    return Microservice.create({
      itemOrder: index,
      loaded: true,
      ready: true,
      ...microService
    });
  });

  dispatch('InitializePrivate', {
    data: privateModelObjects.concat(microServiceObjects)
  });
};
