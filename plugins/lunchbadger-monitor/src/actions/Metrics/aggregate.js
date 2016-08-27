const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (bundleOne, bundleTwo) => {
  dispatch('Aggregate', {
    bundleOne,
    bundleTwo
  });
}
