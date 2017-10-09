import _ from 'lodash';
import Connections from '../stores/Connections';
import {isInQuadrant, findEntity} from '../utils/storeUtils';

const statesToSave = [
  'currentElement',
  'currentlyOpenedPanel',
];

const setStatesToSave = (state) => {
  const states = [];
  statesToSave.forEach((key) => {
    if (!state.states.hasOwnProperty(key)) return;
    const value = state.states[key];
    if (typeof value === 'undefined' || value === null) return;
    if (value && value.toJSON && typeof value.toJSON === 'function') {
      states.push({key, value: {id: value.id, type: value.constructor.entities}});
    } else {
      states.push({key, value});
    }
  });
  const {currentForecast, currentForecastInformation} = state.states;
  if (currentForecast) {
    states.push({
      key: 'currentForecast',
      value: {
        id: currentForecast.forecast.id,
        expanded: currentForecast.expanded || false,
        left: currentForecast.forecast.left || 0,
        top: currentForecast.forecast.top || 0,
        selectedDate: currentForecast.selectedDate,
      },
    });
  }
  if (currentForecastInformation) {
    states.push({
      key: 'currentForecastInformation',
      value: currentForecastInformation,
    });
  }
  const multiEnvironments = _.cloneDeep(state.multiEnvironments);
  multiEnvironments.environments.forEach((_, idx) => {
    multiEnvironments.environments[idx].entities = {};
    Object.keys(state.multiEnvironments.environments[idx].entities).forEach((id) => {
      multiEnvironments.environments[idx].entities[id] = {
        ...state.multiEnvironments.environments[idx].entities[id].toJSON(),
        type: state.multiEnvironments.environments[idx].entities[id].constructor.type,
      };
    })
  });
  states.push({
    key: 'multiEnvironments',
    value: multiEnvironments,
  });
  return states;
}

export default [
  state => ({
    name: 'main',
    connections: Connections.toJSON().filter(({fromId, toId}) =>
      !isInQuadrant(state, 0, fromId) || findEntity(state, 1, toId).constructor.type === 'Function'),
    states: setStatesToSave(state),
  }),
];
