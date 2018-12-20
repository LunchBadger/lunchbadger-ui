import Aside from './Aside/Aside';
import Button from './Button/Button';
import Checkbox from './Form/Checkbox';
import CodeEditor from './Form/CodeEditor';
import CollapsibleProperties from './CollapsibleProperties/CollapsibleProperties';
import ContextualInformationMessage from './ContextualInformationMessage/ContextualInformationMessage';
import ContextualMenu from './ContextualMenu/ContextualMenu';
import CopyOnHover from './CopyOnHover/CopyOnHover';
import DocsLink from './DocsLink/DocsLink';
import Entity from './Entity/Entity';
import EntityActionButtons from './Entity/EntityActionButtons/EntityActionButtons';
import EntityError from './Entity/EntityError/EntityError';
import EntityProperties from './Entity/EntityProperties/EntityProperties';
import EntityProperty from './Entity/EntityProperty/EntityProperty';
import EntityPropertyLabel from './Entity/EntityPropertyLabel/EntityPropertyLabel';
import EntityStatus from './Entity/EntityStatus/EntityStatus';
import EntitySubElements from './Entity/EntitySubElements/EntitySubElements';
import EntityValidationErrors from './Entity/EntityValidationErrors/EntityValidationErrors';
import FilesEditor from './FilesEditor/FilesEditor';
import IconButton from './IconButton/IconButton';
import IconMenu from './IconMenu/IconMenu';
import IconSVG from './IconSVG/IconSVG';
import Input from './Form/Input';
import PanelBar from './Header/PanelBar/PanelBar';
import PasswordStrengthMeter from './PasswordStrengthMeter/PasswordStrengthMeter';
import Select from './Form/Select';
import SmoothCollapse from './utils/SmoothCollapse/SmoothCollapse';
import Sortable from './Sortable/Sortable';
import SystemDefcon1 from './SystemDefcon1/SystemDefcon1';
import SystemInformationMessages from './SystemInformationMessages/SystemInformationMessages';
import Resizable from './Resizable/Resizable';
import ResizableWrapper from './ResizableWrapper/ResizableWrapper';
import RnD from './RnD/RnD';
import Table from './Table/Table';
import Tool from './Aside/Tool/Tool';
import Toolbox from './Toolbox/Toolbox';
import TopBar from './Header/TopBar/TopBar';
import Transitioning from './Transitioning/Transitioning';
import UIDefaults from './utils/UIDefaults';
import Walkthrough from './Walkthrough/Walkthrough';
import {blockedEscapingKeys} from './Walkthrough/WalkthroughInner';
import {Form} from './utils/Formsy/main';
import {
  getDefaultValueByType,
  scrollToElement,
  openDetailsPanelWithAutoscroll,
  labels,
  sortStrings,
} from './utils';
import {GAEvent, setGAUserId} from './GA/GA';
import icons from './icons';

const {
  iconApi,
  iconDataSource,
  iconEndpoint,
  iconFunction,
  iconGateway,
  iconMicroservice,
  iconModel,
  iconPortal,
  iconDataSourceMemory,
  iconDataSourceREST,
  iconDataSourceSOAP,
  iconDataSourceMongoDB,
  iconDataSourceRedis,
  iconDataSourceMySQL,
  iconDataSourcePostgreSQL,
  iconDataSourceEthereum,
  iconDataSourceSalesforce,
  iconDataSourceTritonObjectStorage,
} = icons;

const entityIcons = {
  API: iconApi,
  ApiEndpoint: iconEndpoint,
  DataSource: iconDataSource,
  Function_: iconFunction,
  Gateway: iconGateway,
  Microservice: iconMicroservice,
  Model: iconModel,
  Portal: iconPortal,
  ServiceEndpoint: iconEndpoint,
};

const dataSourceIcons = {
  memory: iconDataSourceMemory,
  rest: iconDataSourceREST,
  soap: iconDataSourceSOAP,
  mongodb: iconDataSourceMongoDB,
  redis: iconDataSourceRedis,
  mysql: iconDataSourceMySQL,
  postgresql: iconDataSourcePostgreSQL,
  web3: iconDataSourceEthereum,
  salesforce: iconDataSourceSalesforce,
  manta: iconDataSourceTritonObjectStorage,
};

export {
  Aside,
  blockedEscapingKeys,
  Button,
  Checkbox,
  CodeEditor,
  CollapsibleProperties,
  ContextualInformationMessage,
  ContextualMenu,
  CopyOnHover,
  UIDefaults,
  dataSourceIcons,
  DocsLink,
  Entity,
  EntityActionButtons,
  EntityError,
  entityIcons,
  EntityProperties,
  EntityProperty,
  EntityPropertyLabel,
  EntityStatus,
  EntitySubElements,
  EntityValidationErrors,
  FilesEditor,
  Form,
  getDefaultValueByType,
  GAEvent,
  IconButton,
  IconMenu,
  icons,
  IconSVG,
  Tool,
  Input,
  labels,
  openDetailsPanelWithAutoscroll,
  PanelBar,
  PasswordStrengthMeter,
  Resizable,
  ResizableWrapper,
  RnD,
  scrollToElement,
  Select,
  setGAUserId,
  SmoothCollapse,
  Sortable,
  SystemDefcon1,
  SystemInformationMessages,
  Table,
  Toolbox,
  TopBar,
  Transitioning,
  Walkthrough,
  sortStrings,
};
