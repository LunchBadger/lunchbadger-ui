const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
const Model = LunchBadgerManage.models.Model;
const ModelProperty = LunchBadgerManage.models.ModelProperty;

export default (data) => {
  const privateModels = data.privateModels;

  const privateModelObjects = privateModels.map((privateModel, index) => {
    // remove properties before de-serializing data but first save it somewhere
    const embeddedProperties = privateModel.privateModelProperties;
    delete privateModel.privateModelProperties;

    const model = Model.create({
      itemOrder: index,
      loaded: true,
      ...privateModel
    });

    embeddedProperties.forEach((property) => {
      model.addProperty(ModelProperty.create(property));
    });

    return model;
  });

  dispatch('InitializePrivate', {
    data: privateModelObjects
  });
};
