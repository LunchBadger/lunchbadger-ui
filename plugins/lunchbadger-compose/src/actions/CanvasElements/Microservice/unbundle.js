const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export const unbundleStart = (microservice) => {
  dispatch('UnbundleMicroserviceStart', {microservice});
};

export const unbundleFinish = (microservice, model) => {
  dispatch('UnbundleMicroserviceFinish', {
    microservice,
    model
  });
};
