const {dispatch} = LBCore.dispatcher.AppDispatcher;

export default (gateway, name) => {
  dispatch('AddPipeline', {
    gateway,
    name: name || 'Pipeline'
  });
};
