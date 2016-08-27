const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (plan, date) => {
  dispatch('AddTier', {
    plan,
    fromDate: date
  });
};
