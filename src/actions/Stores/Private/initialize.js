const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
const Model = LunchBadgerManage.models.Model;

export default (data) => {
  const privateModels = data.privateModels;

  const privateModelObjects = privateModels.map((privateModel, index) => {
    return Model.create({
      itemOrder: index,
      loaded: true,
      ...privateModel
    });
  });

  dispatch('InitializePrivate', {
    data: privateModelObjects
  });
};
