import Aside from './Aside/Aside';
import Tool from './Aside/Tool/Tool';
import Button from './Button/Button';
import CollapsibleProperties from './CollapsibleProperties/CollapsibleProperties';
import IconButton from './IconButton/IconButton';
import IconMenu from './IconMenu/IconMenu';
import IconSVG from './IconSVG/IconSVG';
import Toolbox from './Toolbox/Toolbox';
import ContextualInformationMessage from './ContextualInformationMessage/ContextualInformationMessage';
import ContextualMenu from './ContextualMenu/ContextualMenu';
import SystemDefcon1 from './SystemDefcon1/SystemDefcon1';
import SystemInformationMessages from './SystemInformationMessages/SystemInformationMessages';
import SystemNotifications from './SystemNotifications/SystemNotifications';
import TopBar from './Header/TopBar/TopBar';
import PanelBar from './Header/PanelBar/PanelBar';
import RnD from './RnD/RnD';
import FilesEditor from './FilesEditor/FilesEditor';

import Entity from './Entity/Entity';
import EntityActionButtons from './Entity/EntityActionButtons/EntityActionButtons';
import EntityError from './Entity/EntityError/EntityError';
import EntityProperties from './Entity/EntityProperties/EntityProperties';
import EntityProperty from './Entity/EntityProperty/EntityProperty';
import EntityPropertyLabel from './Entity/EntityPropertyLabel/EntityPropertyLabel';
import EntityStatus from './Entity/EntityStatus/EntityStatus';
import EntitySubElements from './Entity/EntitySubElements/EntitySubElements';
import EntityValidationErrors from './Entity/EntityValidationErrors/EntityValidationErrors';

import Input from './Form/Input';
import Checkbox from './Form/Checkbox';
import Select from './Form/Select';
import CodeEditor from './Form/CodeEditor';

import Table from './Table/Table';
import CopyOnHover from './CopyOnHover/CopyOnHover';

import SmoothCollapse from './utils/SmoothCollapse/SmoothCollapse';
import Sortable from './Sortable/Sortable';
import Transitioning from './Transitioning/Transitioning';
import Walkthrough, {blockedEscapingKeys} from './Walkthrough/Walkthrough';
import {Form} from './utils/Formsy/main';
import {
  scrollToElement,
  openDetailsPanelWithAutoscroll,
} from './utils';
import Resizable from './Resizable/Resizable';
import ResizableWrapper from './ResizableWrapper/ResizableWrapper';
import PasswordStrengthMeter from './PasswordStrengthMeter/PasswordStrengthMeter';
import GA, {GAEvent} from './GA/GA';

import {
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
} from '../../../src/icons';

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
  Memory: iconDataSourceMemory,
  REST: iconDataSourceREST,
  SOAP: iconDataSourceSOAP,
  MongoDB: iconDataSourceMongoDB,
  Redis: iconDataSourceRedis,
  MySQL: iconDataSourceMySQL,
  PostgreSQL: iconDataSourcePostgreSQL,
  Ethereum: iconDataSourceEthereum,
  Salesforce: iconDataSourceSalesforce,
  TritonObjectStorage: iconDataSourceTritonObjectStorage,
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
  Entity,
  EntityActionButtons,
  EntityError,
  EntityProperties,
  EntityProperty,
  EntityPropertyLabel,
  EntityStatus,
  EntitySubElements,
  EntityValidationErrors,
  FilesEditor,
  Form,
  GA,
  GAEvent,
  IconButton,
  IconMenu,
  IconSVG,
  Input,
  openDetailsPanelWithAutoscroll,
  PanelBar,
  PasswordStrengthMeter,
  Resizable,
  ResizableWrapper,
  RnD,
  scrollToElement,
  Select,
  SmoothCollapse,
  Sortable,
  SystemDefcon1,
  SystemInformationMessages,
  SystemNotifications,
  Table,
  Tool,
  Toolbox,
  TopBar,
  Transitioning,
  Walkthrough,
  entityIcons,
  dataSourceIcons,
};

// if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
//   global.LunchBadgerUI = LunchBadgerUI;
// }
//
// module.exports = LunchBadgerUI;
