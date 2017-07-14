const initialState = {
  currentlyOpenedPanel: null,
  panelEditingStatus: false,
  panelEditingStatusSave: null,
  panelEditingStatusDiscard: null,
};

const appState = (state = initialState, action) => {
  const newState = {...state};
  switch (action.type) {
    case 'APP_STATE/INITIALIZE':
      action.states.forEach((state) => {
        if (state.key === 'currentlyOpenedPanel') {
          newState.currentlyOpenedPanel = state.value;
        }
      });
      return newState;
    case 'APP_STATE/TOGGLE_PANEL':
      let panel = action.panel;
      if (newState.currentlyOpenedPanel === panel) {
        panel = null;
      }
      // if (panel !== null) {
      //   newState.currentEditElement = null;
      // }
      newState.currentlyOpenedPanel = panel;
      // newState.isPanelOpened = !!panel ;
    case 'APP_STATE/CHANGE_PANEL_STATUS':
      newState.panelEditingStatus = !!action.status;
      newState.panelEditingStatusSave = action.saveAction || null;
      newState.panelEditingStatusDiscard = action.discardAction || null;
      return newState;
    default:
      return state;
  }
}

export default appState;
