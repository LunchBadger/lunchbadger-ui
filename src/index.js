/**
 * This file is entry point for each plugin
 * You need to import this file to get access to core api and base elements
 */

//dispatcher
import * as AppDispatcher from './dispatcher/AppDispatcher';

// Components
import Panel from './components/Panel/Panel';
import CanvasElement from './components/CanvasElements/CanvasElement';
import BaseDetails from './components/Panel/EntitiesDetails/BaseDetails';

// models
import BaseModel from './models/BaseModel';
import Plugin from './models/Plugin';
import PanelButtonComponent from './models/Plugin/PanelButtonComponent';
import PanelComponent from './models/Plugin/PanelComponent';
import ToolComponent from './models/Plugin/ToolComponent';

// actions
import registerPlugin from './actions/registerPlugin';

export {
  AppDispatcher,
  Panel,
  CanvasElement,
  BaseDetails,
  BaseModel,
  Plugin,
  PanelButtonComponent,
  PanelComponent,
  ToolComponent,
  registerPlugin
}
