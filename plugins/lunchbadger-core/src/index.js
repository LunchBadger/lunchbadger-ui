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
import AppLoader from './components/App/AppLoader';
import Panel from './components/Panel/Panel';
import CanvasElement from './components/CanvasElements/CanvasElement';
import BaseDetails from './components/Panel/EntitiesDetails/BaseDetails';
import CollapsableDetails from './components/Panel/EntitiesDetails/CollapsableDetails';
import Input from './components/Generics/Form/Input';
import Textarea from './components/Generics/Form/Textarea';
import Checkbox from './components/Generics/Form/Checkbox';
import Select from './components/Generics/Form/Select';
import InputField from './components/Panel/EntitiesDetails/InputField';
import CheckboxField from './components/Panel/EntitiesDetails/CheckboxField';
import SelectField from './components/Panel/EntitiesDetails/SelectField';
import CloseButton from './components/Panel/CloseButton';
import SaveButton from './components/Panel/SaveButton';
import Draggable from './components/Draggable/Draggable';
import Modal from './components/Generics/Modal/Modal';
import OneOptionModal from './components/Generics/Modal/OneOptionModal';
import TwoOptionModal from './components/Generics/Modal/TwoOptionModal';
import Quadrant from './components/Quadrant/Quadrant';
import PortComponent from './components/CanvasElements/Port';
import DraggableGroup from './components/Draggable/DraggableGroup';
import ElementsBundler from './components/CanvasElements/ElementsBundler';

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
import removeConnection from './actions/Connection/remove';
import initializeAppState from './actions/Stores/AppState/initialize';

// constants
import panelKeys from './constants/panelKeys';
import portGroups from './constants/portGroups';

// services
import ProjectService from './services/ProjectService';
import ConfigStoreService from './services/ConfigStoreService';

// utils
import ApiClient from './utils/ApiClient';
import * as URLParams from './utils/URLParamsBind';
import {waitForStores} from './utils/waitForStores';
import createLoginManager from './utils/auth';
import {loadFromServer, saveToServer} from './utils/serverIo';
import handleFatals from './utils/handleFatals';
import './utils/formValidators';

let LunchBadgerCore = {
  dispatcher: {
    AppDispatcher: AppDispatcher
  },
  actions: {
    registerPlugin: registerPlugin,
    Connection: {
      removeConnection: removeConnection
    },
    Stores: {
      AppState: {
        initialize: initializeAppState
      }
    }
  },
  components: {
    App: App,
    AppLoader: AppLoader,
    Panel: Panel,
    CanvasElement: CanvasElement,
    BaseDetails: BaseDetails,
    CollapsableDetails: CollapsableDetails,
    Input: Input,
    Textarea: Textarea,
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
    OneOptionModal: OneOptionModal,
    TwoOptionModal: TwoOptionModal,
    Quadrant: Quadrant,
    Port: PortComponent,
    ElementsBundler: ElementsBundler
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
    ProjectService: ProjectService,
    ConfigStoreService: ConfigStoreService
  },
  utils: {
    ApiClient: ApiClient,
    URLParams: URLParams,
    waitForStores: waitForStores,
    handleFatals: handleFatals,
    serverIo: {
      loadFromServer: loadFromServer,
      saveToServer: saveToServer
    },
    createLoginManager: createLoginManager,
    propertyTypes: [
      {label: 'String', value: 'string'},
      {label: 'Number', value: 'number'},
      {label: 'Date', value: 'date'},
      {label: 'Boolean', value: 'boolean'},
      {label: 'GeoPoint', value: 'geopoint'},
      {label: 'Array', value: 'array'},
      {label: 'Object', value: 'object'},
      {label: 'Buffer', value: 'buffer'},
    ],
    gatewayPoliciesOptions: [
      {label: 'OAuth2', value: 'OAuth2'},
      {label: 'Throttling', value: 'Rate limit'},
      {label: 'Logging', value: 'Logging'},
      {label: 'Redirect', value: 'Redirect'},
    ],
    defaultEntityNames: {
      Model: 'NewModel',
    },
  },
};

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.LunchBadgerCore = LunchBadgerCore;
}

module.exports = LunchBadgerCore;
