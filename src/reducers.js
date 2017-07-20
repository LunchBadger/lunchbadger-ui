import {combineReducers} from 'redux';
import core from '../plugins/lunchbadger-core/src/reducers';
import ui from '../plugins/lunchbadger-ui/src/reducers';

let entities = {};
const plugins = {};

export const registerPlugin = (reducers, plugs) => {
  entities = {
    ...entities,
    ...reducers
  };
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
      });
    }
    if (plugs.services) {
      if (!plugins.services) plugins.services = [];
      plugins.services = [
        ...plugins.services,
        ...plugs.services
      ];
    }
    if (plugs.canvasElements) {
      if (!plugins.canvasElements) plugins.canvasElements = {};
      plugins.canvasElements = {
        ...plugins.canvasElements,
        ...plugs.canvasElements
      };
    }
    if (plugs.onAppLoad) {
      if (!plugins.onAppLoad) plugins.onAppLoad = [];
      plugins.onAppLoad = [
        ...plugins.onAppLoad,
        ...plugs.onAppLoad
      ];
    }
  }
};

export default () => combineReducers({
  core,
  ui,
  entities: combineReducers(entities),
  plugins: (state = plugins) => state
});
