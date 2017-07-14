export const initialize = states => ({
  type: 'APP_STATE/INITIALIZE',
  states,
});

export const changePanelStatus = (status, saveAction, discardAction) => ({
  type: 'APP_STATE/CHANGE_PANEL_STATUS',
  status,
  saveAction,
  discardAction
});

export const togglePanel = panel => ({
  type: 'APP_STATE/TOGGLE_PANEL',
  panel,
});
