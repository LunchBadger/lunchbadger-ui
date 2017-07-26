import {actions} from './actions';

export const setCurrentElement = value => (dispatch, getState) => {
  const {currentElement} = getState().states;
  if (currentElement && currentElement.data.id === value.data.id) return;
  dispatch(actions.setStates({key: 'currentElement', value}));
}

export const clearCurrentElement = () => (dispatch, getState) => {
  const state = getState();
  const {panelEditingStatus} = state.core.appState;
  const {currentElement} = state.states;
  if (panelEditingStatus || currentElement === null) return;
  dispatch(actions.setStates({key: 'currentElement', value: null}));
}
