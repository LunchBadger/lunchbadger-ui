export const updateEntitiesStatues = () => (dispatch, getState) => {
  const {loadedProject, plugins: {onEntitiesStatusesChange}} = getState();
  if (!loadedProject) return;
  onEntitiesStatusesChange.map(onChange => dispatch(onChange()));
};
