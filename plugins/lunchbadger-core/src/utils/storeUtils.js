import _ from 'lodash';

export const formatId = id => id.split('_').slice(-1)[0];

export const isInQuadrant = (state, quadrantIdx, id) =>
  state.plugins.quadrants[quadrantIdx].connectionEntities
    .map(type => Object.keys(state.entities[type]))
    .reduce((arr, item) => arr.concat(item), [])
    .includes(formatId(id));

export const findEntity = (state, quadrantIdx, id) =>
  state.plugins.quadrants[quadrantIdx].connectionEntities
    .map(type => Object.keys(state.entities[type]).map(key => state.entities[type][key]))
    .reduce((arr, item) => arr.concat(item), [])
    .find(item => item.id === formatId(id));

export const findEntityByName = (state, quadrantIdx, name) =>
  state.plugins.quadrants[quadrantIdx].connectionEntities
    .map(type => Object.keys(state.entities[type]).map(key => state.entities[type][key]))
    .reduce((arr, item) => arr.concat(item), [])
    .find(item => item.name === name);

export const filterConnections = (state, filter) =>
  _.filter(state.connections, filter);
