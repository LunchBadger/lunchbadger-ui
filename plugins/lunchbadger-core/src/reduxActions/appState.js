export const changePanelStatus = (status, saveAction, discardAction) => ({
  type: 'APP_STATE/CHANGE_PANEL_STATUS',
  status,
  saveAction,
  discardAction
});
