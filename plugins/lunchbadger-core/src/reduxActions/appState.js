export const initialize = (states, revisions, data) => ({
  type: 'APP_STATE/INITIALIZE',
  states,
  revisions,
  data,
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
