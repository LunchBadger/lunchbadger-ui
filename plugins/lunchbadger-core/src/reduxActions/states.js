import _ from 'lodash';
import {actions} from './actions';

export const createModelsFromJSON = response => (dispatch, getState) => {
  const {plugins: {models}} = getState();
  let json;
  if (document.location.search === '?multi') {
    const multiEnvironments = response.body.states.find(({key}) => key === 'multiEnvironments');
    if (multiEnvironments) {
      json = multiEnvironments.value;
      json.environments.forEach((_, idx) => {
        const {entities} = json.environments[idx];
        Object.keys(entities).forEach((id) => {
          entities[id] = models[entities[id].type].create(entities[id]);
        });
      });
      dispatch(actions.multiEnvironmentsSetOnLoad(json));
    }
  }
}

export const setCurrentElement = entity => (dispatch, getState) => {
  const {currentElement} = getState().states;
  if (currentElement === null && entity === null) return;
  if (currentElement && entity && currentElement.id === entity.id) return;
  let value = null;
  if (entity) {
    const {id, constructor: {entities: type}} = entity;
    value = {id, type};
  }
  dispatch(actions.setStates([
    {key: 'currentElement', value},
    {key: 'currentlySelectedParent', value: null},
    {key: 'currentlySelectedSubelements', value: []},
  ]));
};

export const clearCurrentElement = () => (dispatch, getState) => {
  const {currentElement, panelEditingStatus} = getState().states;
  if (panelEditingStatus || currentElement === null) return;
  dispatch(actions.setStates([
    {key: 'currentElement', value: null},
    {key: 'currentlySelectedParent', value: null},
    {key: 'currentlySelectedSubelements', value: []},
  ]));
};

export const setCurrentEditElement = value => (dispatch, getState) => {
  const {currentEditElement} = getState().states;
  if (currentEditElement && value && currentEditElement.id === value.id) return;
  if (currentEditElement === null && currentEditElement === value) return;
  dispatch(actions.setStates([
    {key: 'currentEditElement', value},
    {key: 'currentlySelectedParent', value: null},
    {key: 'currentlySelectedSubelements', value: []},
  ]));
};

export const clearCurrentEditElement = () => (dispatch) => {
  dispatch(actions.setStates([
    {key: 'currentElement', value: null},
    {key: 'currentEditElement', value: null},
    {key: 'currentlySelectedParent', value: null},
    {key: 'currentlySelectedSubelements', value: []},
  ]));
};

export const setCurrentZoom = value => (dispatch, getState) => {
  const {zoom} = getState().states;
  if (zoom === value) return;
  dispatch(actions.setState({key: 'zoom', value}));
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

export const toggleSubelement = (parent, subelement) => (dispatch, getState) => {
  const newStates = [];
  const {currentlySelectedSubelements, currentlySelectedParent} = getState().states;
  if (currentlySelectedParent && parent.id === currentlySelectedParent.id) {
    if (_.find(currentlySelectedSubelements, {id: subelement.id})) {
      newStates.push({
        key: 'currentlySelectedSubelements',
        value: currentlySelectedSubelements.filter(item => item.id !== subelement.id),
      });
    } else {
      newStates.push({
        key: 'currentlySelectedSubelements',
        value: [...currentlySelectedSubelements, subelement],
      });
    }
  } else {
    newStates.push({key: 'currentlySelectedParent', value: parent});
    newStates.push({key: 'currentlySelectedSubelements', value: [subelement]});
  }
  dispatch(actions.setStates(newStates));
};
