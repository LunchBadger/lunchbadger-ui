import _ from 'lodash';
import {actions} from './actions';
import {saveToServer} from './project';
import {GAEvent} from '../../../lunchbadger-ui/src';

const stringifyPendingEdit = obj => Object.keys(obj)
  .sort()
  .reduce((arr, key) => [...arr, `${key}|${obj[key]}`], [])
  .join(',');

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
  if (value && value.id && value.loaded) {
    dispatch(setPendingEdit('add', value.id, false));
  } else if (currentEditElement && currentEditElement.id && currentEditElement.loaded) {
    dispatch(setPendingEdit('remove', currentEditElement.id, false));
  }
};

export const clearCurrentEditElement = (silent = false) => (dispatch, getState) => {
  if (!silent) {
    const {currentEditElement, currentElement} = getState().states;
    if (currentEditElement && currentEditElement.id && currentEditElement.loaded) {
      dispatch(setPendingEdit('remove', currentEditElement.id, false));
    } else if (currentElement && currentElement.id) {
      dispatch(setPendingEdit('remove', currentElement.id, false));
    }
  }
  dispatch(actions.setStates([
    {key: 'currentElement', value: null},
    {key: 'currentEditElement', value: null},
    {key: 'currentlySelectedParent', value: null},
    {key: 'currentlySelectedSubelements', value: []},
  ]));
};

export const setCurrentZoom = (value, silent = false) => (dispatch, getState) => {
  const {
    states: {
      zoom, currentElement = {}
    },
    entities,
  } = getState();
  if (zoom === value) return;
  dispatch(actions.setState({key: 'zoom', value}));
  if (!silent) {
    const {id, type} = currentElement || {};
    if (id && type && entities[type][id] && entities[type][id].locked) return;
    dispatch(setPendingEdit(value && id ? 'add' : 'remove', id, false));
  }
};

export const setPendingEdit = (operation, entityId, silent = true, inc = false, pendingEditNew) =>
  (dispatch, getState) => {
    const {states} = getState();
    const {pendingEdit = {}} = states;
    pendingEditNew = pendingEditNew || {...pendingEdit};
    const locked = operation !== 'remove';
    if (locked) {
      pendingEditNew[entityId] = pendingEditNew[entityId] || 0;
      if (inc) {
        pendingEditNew[entityId] += 1;
      }
    } else {
      delete pendingEditNew[entityId];
    }
    dispatch(actions.setState({key: 'pendingEdit', value: pendingEditNew}));
    if (silent) {
      dispatch(actions.toggleLockEntity({locked, entityId}));
      if (operation === 'replace') {
        const currentEditElement = states.currentEditElement || {};
        const canvasEditedId = currentEditElement.lunchbadgerId || currentEditElement.id;
        // const canvasEditedType = (currentEditElement.constructor || {}).type;
        const zoomEditedId = !!states.zoom && (states.currentElement || {}).id;
        let isCanvasEdited = !!entityId && canvasEditedId === entityId;
        // FIXME: bundled types
        // if (entityType === 'modelsBundled'
        //   && canvasEditedType === 'Microservice'
        //   && prevResponse.microservices[canvasEditedId].models.includes(entityId)
        // ) {
        //   isCanvasEdited = true;
        // }
        const isZoomEdited = !!entityId && zoomEditedId === entityId;
        if (isCanvasEdited || isZoomEdited) {
          if (isCanvasEdited) {
            dispatch(clearCurrentEditElement(true));
          }
          if (isZoomEdited) {
            dispatch(setCurrentZoom(undefined, true));
          }
          dispatch(setSilentReloadAlertVisible(true));
        }
      }
    } else if (stringifyPendingEdit(pendingEdit) !== stringifyPendingEdit(pendingEditNew)) {
      dispatch(saveToServer());
    }
  };

export const togglePanel = panel => (dispatch, getState) => {
  const {currentlyOpenedPanel} = getState().states;
  const value = currentlyOpenedPanel === panel ? null : panel;
  dispatch(actions.setState({key: 'currentlyOpenedPanel', value}));
  const makeUpCase = str => str.replace(/_/g, ' ').toLowerCase();
  const gaLog = value
    ? `Opened ${makeUpCase(value)}`
    : `Closed ${makeUpCase(currentlyOpenedPanel)}`;
  GAEvent('Header Menu', gaLog);
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

export const setCurrentlySelectedParent = entity => (dispatch, getState) => {
  const {currentlySelectedParent} = getState().states;
  if (currentlySelectedParent && entity.id !== currentlySelectedParent.id) {
    const currentElement = {
      id: entity.id,
      type: entity.constructor.entities,
    };
    dispatch(actions.setStates([
      {key: 'currentElement', value: currentElement},
      {key: 'currentlySelectedParent', value: entity},
    ]));
  }
};

export const setSilentReloadAlertVisible = value => (dispatch, getState) => {
  const {silentReloadAlertVisible} = getState().states;
  if (silentReloadAlertVisible === value) return;
  dispatch(actions.setState({key: 'silentReloadAlertVisible', value}));
};
