export const initialize = (states, revisions, data) => ({
  type: 'APP_STATE/INITIALIZE',
  states,
  revisions,
  data,
});

export const changePanelStatus = (status, saveAction, discardAction) => ({
  type: 'APP_STATE/CHANGE_PANEL_STATUS',
  status,
  saveAction,
  discardAction,
});

export const toggleSubelement = (parent, subelement) => ({
  type: 'APP_STATE/TOGGLE_SUBELEMENT',
  parent,
  subelement,
});

export const removeEntity = id => ({
  type: 'APP_STATE/REMOVE_ENTITY',
  id,
});
