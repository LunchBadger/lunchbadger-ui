const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
const Model = LunchBadgerManage.models.Model;

export default (name) => {
  dispatch('AddModel', {
    model: Model.create({
      name: name || 'Model'
    })
  });
};
