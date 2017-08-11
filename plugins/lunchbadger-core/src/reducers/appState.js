import _ from 'lodash';

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
    default:
      return state;
  }
}

export default appState;
