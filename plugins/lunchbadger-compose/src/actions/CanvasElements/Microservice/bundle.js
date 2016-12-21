const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (microservice, model) => {
  dispatch('BundleMicroservice', {
    microservice,
    model
  });
};
