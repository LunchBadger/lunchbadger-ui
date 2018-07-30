import _ from 'lodash';

export const formatId = id => id.split('_').slice(-1)[0];

export const isInQuadrant = (state, quadrantIdx, entityId) =>
  _.find(
    state.plugins.quadrants[quadrantIdx].connectionEntities
      .map(type => Object.keys(state.entities[type]))
      .reduce((arr, item) => arr.concat(item), []),
    id => id === formatId(entityId),
  );

export const isInPrivateQuadrant = (state, entityId) => _.find(
    state.plugins.quadrants[1].modelEntities
      .map(type => ({type, ids: Object.keys(state.entities[type])}))
      .map(({type, ids}) => ids.map(id => state.entities[type][id].models))
      .reduce((arr, item) => arr.concat(...item), []),
    ({id}) => id === formatId(entityId),
  );

export const isInPublicQuadrant = (state, entityId) => _.find(
    state.plugins.quadrants[3].connectionEntities
      .map(type => ({type, ids: Object.keys(state.entities[type])}))
      .map(({type, ids}) => ids.map(id => state.entities[type][id].apiEndpoints))
      .reduce((arr, item) => arr.concat(...item), []),
    ({id}) => id === formatId(entityId),
  );

export const findEntity = (state, quadrantIdx, id) =>
  state.plugins.quadrants[quadrantIdx].connectionEntities
    .map(type => Object.keys(state.entities[type]).map(key => state.entities[type][key]))
    .reduce((arr, item) => arr.concat(item), [])
    .find(item => item.id === formatId(id));

export const findGatewayByPipelineId = (state, id) =>
  state.plugins.quadrants[2].connectionEntities
    .map(type => Object.keys(state.entities[type]).map(key => state.entities[type][key]))
    .reduce((arr, item) => arr.concat(item), [])
    .find(item => item.pipelines.map(p => p.id).includes(formatId(id)));

export const findEntityByName = (state, quadrantIdx, name) =>
  state.plugins.quadrants[quadrantIdx].connectionEntities
    .map(type => Object.keys(state.entities[type]).map(key => state.entities[type][key]))
    .reduce((arr, item) => arr.concat(item), [])
    .find(item => item.name === name);
