import {combineReducers} from 'redux';
import ui from '../../../lunchbadger-ui/src/reducers';

let reducers = {};
let entities = {};
const plugins = {};

const arraysToRegister = [
  'services',
  'onAppLoad',
  'onProjectSave',
  'onBeforeProjectSave',
  'panels',
  'onSaveOrder',
  'onConnectionCreatedStrategy',
  'onConnectionMovedStrategy',
  'onConnectionDeletedStrategy'
];

const objectsToRegister = [
  'canvasElements',
  'panelDetailsElements',
  'onUpdate',
  'onDelete',
  'onDiscardChanges',
  'onValidate',
  'panelMenu',
  'models'
];

const registerArrays = (plugins, plugs) => {
  arraysToRegister.forEach((key) => {
    if (plugs[key]) {
      if (!plugins[key]) plugins[key] = [];
      plugins[key] = [
        ...plugins[key],
        ...plugs[key]
      ];
    }
  });
}

const registerObjects = (plugins, plugs) => {
  objectsToRegister.forEach((key) => {
    if (plugs[key]) {
      if (!plugins[key]) plugins[key] = {};
      plugins[key] = {
        ...plugins[key],
        ...plugs[key]
      };
    }
  });
}

export const registerPlugin = (_entities, plugs, _reducers = {}) => {
  entities = {
    ...entities,
    ..._entities
  };
  reducers = {
    ...reducers,
    ..._reducers
  }
  if (plugs) {
    if (plugs.tools) {
      if (!plugins.tools) plugins.tools = {};
      Object.keys(plugs.tools).forEach((key) => {
        if (!plugins.tools[key]) plugins.tools[key] = [];
        plugins.tools[key] = [
          ...plugins.tools[key],
          ...plugs.tools[key]
        ];
      });
    }
    if (plugs.quadrants) {
      if (!plugins.quadrants) plugins.quadrants = {};
      Object.keys(plugs.quadrants).forEach((key) => {
        if (!plugins.quadrants[key]) plugins.quadrants[key] = {};
        if (!plugins.quadrants[key].name) plugins.quadrants[key].name = plugs.quadrants[key].name;
        if (!plugins.quadrants[key].entities) plugins.quadrants[key].entities = [];
        plugins.quadrants[key].entities = [
          ...plugins.quadrants[key].entities,
          ...plugs.quadrants[key].entities
        ];
        if (!plugins.quadrants[key].connectionEntities) plugins.quadrants[key].connectionEntities = [];
        plugins.quadrants[key].connectionEntities = [
          ...plugins.quadrants[key].connectionEntities,
          ...plugs.quadrants[key].connectionEntities
        ];
        if (key === '1') {
          if (!plugins.quadrants[key].serviceEndpointEntities) plugins.quadrants[key].serviceEndpointEntities = [];
          plugins.quadrants[key].serviceEndpointEntities = [
            ...plugins.quadrants[key].serviceEndpointEntities,
            ...(plugs.quadrants[key].serviceEndpointEntities || [])
          ];
        }
      });
    }
    registerArrays(plugins, plugs);
    registerObjects(plugins, plugs);
  }
};

export default () => combineReducers({
    ui,
  ...reducers,
  entities: combineReducers(entities),
  plugins: (state = plugins) => state
});
