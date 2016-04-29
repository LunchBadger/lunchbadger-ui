/**
 * This file is entry point for each plugin
 * You need to import this file to get access to core api and base elements
 */

//dispatcher
import * as AppDispatcher from './src/dispatcher/AppDispatcher';

// Components
import Panel from './src/components/Panel/Panel';
import CanvasElement from './src/components/CanvasElements/CanvasElement';
import BaseDetails from './src/components/Panel/EntitiesDetails/BaseDetails';

// store
import Plugin from './src/stores/Plugin';

export {
  AppDispatcher,
  Panel,
  CanvasElement,
  BaseDetails,
  Plugin
}
