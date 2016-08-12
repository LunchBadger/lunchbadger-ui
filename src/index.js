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
import Connection from './stores/Connection';

// components
import App from './components/App/App';
import Panel from './components/Panel/Panel';
import CanvasElement from './components/CanvasElements/CanvasElement';
import BaseDetails from './components/Panel/EntitiesDetails/BaseDetails';
import CollapsableDetails from './components/Panel/EntitiesDetails/CollapsableDetails';
import Input from './components/Generics/Form/Input';
import Checkbox from './components/Generics/Form/Checkbox';
import Select from './components/Generics/Form/Select';
import InputField from './components/Panel/EntitiesDetails/InputField';
import CheckboxField from './components/Panel/EntitiesDetails/CheckboxField';
import SelectField from './components/Panel/EntitiesDetails/SelectField';
import CloseButton from './components/Panel/CloseButton';
import SaveButton from './components/Panel/SaveButton';
import Draggable from './components/Draggable/Draggable';
import Modal from './components/Generics/Modal/Modal';
import TwoOptionModal from './components/Generics/Modal/TwoOptionModal';
import Quadrant from './components/Quadrant/Quadrant';
import ToolGroup from './components/Tools/ToolGroup';
import Tool from './components/Tools/Tool';
import PortComponent from './components/CanvasElements/Port';
import DraggableGroup from './components/Draggable/DraggableGroup';

// models
import BaseModel from './models/BaseModel';
import Plugin from './models/Plugin';
import PanelButtonComponent from './models/Plugin/PanelButtonComponent';
import PanelComponent from './models/Plugin/PanelComponent';
import ToolComponent from './models/Plugin/ToolComponent';
import ToolGroupComponent from './models/Plugin/ToolGroupComponent';
import QuadrantComponent from './models/Plugin/QuadrantComponent';
import Port from './models/Port';
import ConnectionModel from './models/Connection';
import PanelDetailsComponent from './models/Plugin/PanelDetailsComponent';
import Strategy from './models/Plugin/Strategy';

// actions
import registerPlugin from './actions/registerPlugin';
import togglePanel from './actions/togglePanel';
import toggleHighlight from './actions/CanvasElements/toggleHighlight';
import toggleEdit from './actions/CanvasElements/toggleEdit';
import attachConnection from './actions/Connection/attach';
import reattachConnection from './actions/Connection/reattach';
import removeConnection from './actions/Connection/remove';
import setProjectRevision from './actions/Stores/AppState/setProjectRevision';
import initializeAppState from './actions/Stores/AppState/initialize';
import toggleSubelement from './actions/CanvasElements/toggleSubelement';
import removeEntity from './actions/CanvasElements/removeEntity';

// constants
import panelKeys from './constants/panelKeys';
import portGroups from './constants/portGroups';

// services
import ProjectService from './services/ProjectService';

// utils
import APIInterceptor from './utils/APIInterceptor';
import * as URLParams from './utils/URLParamsBind';
import {waitForStores} from './utils/waitForStores';
import {loadFromServer, saveToServer} from './utils/serverIo';

let LunchBadgerCore = {
  dispatcher: {
    AppDispatcher: AppDispatcher
  },
  actions: {
    registerPlugin: registerPlugin,
    togglePanel: togglePanel,
    toggleHighlight: toggleHighlight,
    toggleEdit: toggleEdit,
    toggleSubelement: toggleSubelement,
    removeEntity: removeEntity,
    Connection: {
      attachConnection: attachConnection,
      reattachConnection: reattachConnection,
      removeConnection: removeConnection
    },
    Stores: {
      AppState: {
        initialize: initializeAppState,
        setProjectRevision: setProjectRevision
      }
    }
  },
  components: {
    App: App,
    Panel: Panel,
    CanvasElement: CanvasElement,
    BaseDetails: BaseDetails,
    CollapsableDetails: CollapsableDetails,
    Input: Input,
    Checkbox: Checkbox,
    Select: Select,
    InputField: InputField,
    CheckboxField: CheckboxField,
    SelectField: SelectField,
    CloseButton: CloseButton,
    SaveButton: SaveButton,
    Draggable: Draggable,
    DraggableGroup: DraggableGroup,
    Modal: Modal,
    TwoOptionModal: TwoOptionModal,
    Quadrant: Quadrant,
    Tool: Tool,
    ToolGroup: ToolGroup,
    Port: PortComponent
  },
  stores: {
    BaseStore: BaseStore,
    AppState: AppState,
    Pluggable: Pluggable,
    Connection: Connection
  },
  models: {
    BaseModel: BaseModel,
    Plugin: Plugin,
    PanelButtonComponent: PanelButtonComponent,
    PanelComponent: PanelComponent,
    ToolComponent: ToolComponent,
    ToolGroupComponent: ToolGroupComponent,
    QuadrantComponent: QuadrantComponent,
    Port: Port,
    Connection: ConnectionModel,
    PanelDetailsComponent: PanelDetailsComponent,
    Strategy: Strategy
  },
  constants: {
    panelKeys: panelKeys,
    portGroups: portGroups
  },
  services: {
    ProjectService: ProjectService
  },
  utils: {
    APIInterceptor: APIInterceptor,
    URLParams: URLParams,
    waitForStores: waitForStores,
    serverIo: {
      loadFromServer: loadFromServer,
      saveToServer: saveToServer
    }
  }
};

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.LunchBadgerCore = LunchBadgerCore;
}

module.exports = LunchBadgerCore;
