const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export const bundleStart = (microservice) => {
  dispatch('BundleMicroserviceStart', {microservice});
};

export const bundleFinish = (microservice, model) => {
  dispatch('BundleMicroserviceFinish', {
    microservice,
    model
  });
};
