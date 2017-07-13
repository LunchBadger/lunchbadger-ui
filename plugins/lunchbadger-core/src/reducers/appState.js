const initialState = {
  currentlyOpenedPanel: null,
  currentEditElement: null,
  isPanelOpened: false,
  currentlySelectedParent: null,
  currentlySelectedSubelements: [],
  panelEditingStatus: false,
  panelEditingStatusSave: null,
  panelEditingStatusDiscard: null,
};

const appState = (state = initialState, action) => {
  switch (action.type) {
    case 'APP_STATE/CHANGE_PANEL_STATUS':
      return {
        ...state,
        panelEditingStatus: !!action.status,
        panelEditingStatusSave: action.saveAction || null,
        panelEditingStatusDiscard: action.discardAction || null,
      }
    default:
      return state;
  }
}

export default appState;
