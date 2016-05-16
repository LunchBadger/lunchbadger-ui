const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (apiCreature, props) => {
  dispatch('AddTier', {
    apiCreature,
    data: {...props}
  });
};
