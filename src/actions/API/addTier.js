const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (apiPlan, props) => {
  dispatch('AddTier', {
    apiPlan,
    data: {...props}
  });
};
