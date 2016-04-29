/**
 * This file is entry point for each plugin
 * You need to import this file to get access to core api and base elements
 */

// dispatcher
import * as AppDispatcher from './dispatcher/AppDispatcher';

// stores
import BaseStore from './stores/BaseStore';
import AppState from './stores/AppState';
import Pluggable from './stores/Pluggable';

// components
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

let LBCore = {};

LBCore.AppDispatcher = AppDispatcher;

LBCore.BaseStore = BaseStore;
LBCore.AppState = AppState;
LBCore.Pluggable = Pluggable;

LBCore.Panel = Panel;
LBCore.CanvasElement = CanvasElement;
LBCore.BaseDetails = BaseDetails;

LBCore.BaseModel = BaseModel;
LBCore.Plugin = Plugin;
LBCore.PanelButtonComponent = PanelButtonComponent;
LBCore.PanelComponent = PanelComponent;
LBCore.ToolComponent = ToolComponent;

LBCore.registerPlugin = registerPlugin;

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.LBCore = LBCore;
}

module.exports = LBCore;
