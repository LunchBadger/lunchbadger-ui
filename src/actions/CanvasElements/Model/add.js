import Model from 'models/Model';

const {dispatch} = LBCore.dispatcher.AppDispatcher;

export default (name) => {
  dispatch('AddModel', {
    model: Model.create({
      name: name || 'Model'
    })
  });
};
