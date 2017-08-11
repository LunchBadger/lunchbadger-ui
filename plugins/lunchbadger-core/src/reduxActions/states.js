import {actions} from './actions';

export const setCurrentElement = value => (dispatch, getState) => {
  const {currentElement} = getState().states;
  if (currentElement && currentElement === value) return;
  dispatch(actions.setState({key: 'currentElement', value}));
};

export const clearCurrentElement = () => (dispatch, getState) => {
  const {currentElement, panelEditingStatus} = getState().states;
  if (panelEditingStatus || currentElement === null) return;
  dispatch(actions.setState({key: 'currentElement', value: null}));
};

export const setCurrentEditElement = value => (dispatch, getState) => {
  const {currentEditElement} = getState().states;
  if (currentEditElement && value && currentEditElement.id === value.id) return;
  if (currentEditElement === null && currentEditElement === value) return;
  dispatch(actions.setState({key: 'currentEditElement', value}));
};

export const togglePanel = panel => (dispatch, getState) => {
  const value = getState().states.currentlyOpenedPanel === panel ? null : panel;
  dispatch(actions.setState({key: 'currentlyOpenedPanel', value}));
};

export const changePanelStatus = (status, saveAction, discardAction) => dispatch =>
  dispatch(actions.setStates([
    {key: 'panelEditingStatus', value: !!status},
    {key: 'panelEditingStatusSave', value: saveAction || null},
    {key: 'panelEditingStatusDiscard', value: discardAction || null},
  ]));
