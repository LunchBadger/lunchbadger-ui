import Model from 'models/Model';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (name) => {
  dispatch('AddModel', {
    model: Model.create({
      name: name || 'Model'
    })
  });
};
