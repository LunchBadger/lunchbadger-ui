const {actions: actionsCore} = LunchBadgerCore.utils;

export default (dispatch, state) => {
  window.dispatchEvent(new Event('ReloadApiExplorer'));
  const {currentlyOpenedPanel} = state.states;
  if (currentlyOpenedPanel === 'API_EXPLORER_PANEL') {
    dispatch(actionsCore.addSystemInformationMessage({
      type: 'success',
      message: 'API Explorer is stale and will be refreshed',
    }));
  }
};
