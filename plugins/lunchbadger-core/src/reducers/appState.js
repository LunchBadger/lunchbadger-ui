import _ from 'lodash';
import {actionTypes} from '../reduxActions/actions';

const initialState = {
  currentlyOpenedPanel: null,
  panelEditingStatus: false,
  panelEditingStatusSave: null,
  panelEditingStatusDiscard: null,
  currentElement: null,
  currentlySelectedParent: null,
  currentlySelectedSubelements: [],
  revisions: {},
};

const appState = (state = initialState, action) => {
  const newState = {...state};
  const {currentlySelectedParent} = newState;
  switch (action.type) {
    case 'APP_STATE/INITIALIZE':
      action.states.forEach((state) => {
        if (['currentlyOpenedPanel', 'currentElement'].includes(state.key)) {
          newState[state.key] = state.value;
        }
      });
      newState.revisions = action.revisions;
      return newState;
    case 'APP_STATE/TOGGLE_EDIT':
      newState.currentEditElement = action.element;
      return newState;
    case 'APP_STATE/TOGGLE_PANEL':
      let panel = action.panel;
      if (newState.currentlyOpenedPanel === panel) {
        panel = null;
      }
      if (panel !== null) {
        newState.currentEditElement = null;
      }
      newState.currentlyOpenedPanel = panel;
      return newState;
    case 'APP_STATE/TOGGLE_HIGHLIGHT':
      newState.currentElement = action.element;
      if (action.element && currentlySelectedParent && currentlySelectedParent.id !== action.element.id) {
        newState.currentlySelectedSubelements = [];
      } else if (action.element === null) {
        newState.currentlySelectedSubelements = [];
        newState.currentlySelectedParent = null;
      }
      return newState;
    case 'APP_STATE/TOGGLE_SUBELEMENT':
      const {parent, subelement} = action;
      const {currentlySelectedSubelements} = newState;
      if (currentlySelectedParent && parent.id === currentlySelectedParent.id) {
        if (_.find(currentlySelectedSubelements, {id: subelement.id})) {
          newState.currentlySelectedSubelements = newState.currentlySelectedSubelements
            .filter(item => item.id !== subelement.id);
        } else {
          newState.currentlySelectedSubelements = [
            ...newState.currentlySelectedSubelements,
            subelement,
          ];
        }
      } else {
        newState.currentlySelectedParent = parent;
        newState.currentlySelectedSubelements = [subelement];
      }
      return newState;
    case 'APP_STATE/CHANGE_PANEL_STATUS':
      newState.panelEditingStatus = !!action.status;
      newState.panelEditingStatusSave = action.saveAction || null;
      newState.panelEditingStatusDiscard = action.discardAction || null;
      return newState;
    case actionTypes.removeEntity:
      newState.currentElement = null;
      newState.currentEditElement = null;
      return newState;
    default:
      return state;
  }
}

export default appState;
