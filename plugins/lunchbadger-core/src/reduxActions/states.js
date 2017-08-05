import {actions} from './actions';

export const setCurrentElement = value => (dispatch, getState) => {
  const {currentElement} = getState().states;
  if (currentElement && currentElement === value) return;
  dispatch(actions.setStates({key: 'currentElement', value}));
};

export const clearCurrentElement = () => (dispatch, getState) => {
  const state = getState();
  const {panelEditingStatus} = state.core.appState;
  const {currentElement} = state.states;
  if (panelEditingStatus || currentElement === null) return;
  dispatch(actions.setStates({key: 'currentElement', value: null}));
};

export const setCurrentEditElement = value => (dispatch, getState) => {
  const {currentEditElement} = getState().states;
  if (currentEditElement && value && currentEditElement.id === value.id) return;
  if (currentEditElement === null && currentEditElement === value) return;
  dispatch(actions.setStates({key: 'currentEditElement', value}));
};

export const togglePanel = panel => (dispatch, getState) => {
  const value = getState().states.currentlyOpenedPanel === panel ? null : panel;
  dispatch(actions.setStates({key: 'currentlyOpenedPanel', value}));
};
