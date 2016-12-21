const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (microservice, model) => {
  dispatch('UnbundleMicroservice', {
    microservice,
    model
  });
};
