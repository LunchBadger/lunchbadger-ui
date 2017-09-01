export const initialize = (states, revisions) => ({
  type: 'APP_STATE/INITIALIZE',
  states,
  revisions,
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

export const toggleEdit = element => ({
  type: 'APP_STATE/TOGGLE_EDIT',
  element,
});

export const toggleHighlight = element => ({
  type: 'APP_STATE/TOGGLE_HIGHLIGHT',
  element,
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
