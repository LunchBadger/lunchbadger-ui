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

import Entity from './Entity/Entity';
import EntityActionButtons from './Entity/EntityActionButtons/EntityActionButtons';
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

import SmoothCollapse from './utils/SmoothCollapse/SmoothCollapse';
import {Form} from './utils/Formsy/main';

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
  Button,
  Checkbox,
  CodeEditor,
  CollapsibleProperties,
  ContextualInformationMessage,
  ContextualMenu,
  Entity,
  EntityActionButtons,
  EntityProperties,
  EntityProperty,
  EntityPropertyLabel,
  EntityStatus,
  EntitySubElements,
  EntityValidationErrors,
  Form,
  IconButton,
  IconMenu,
  IconSVG,
  Input,
  PanelBar,
  RnD,
  Select,
  SmoothCollapse,
  SystemDefcon1,
  SystemInformationMessages,
  SystemNotifications,
  Table,
  Tool,
  Toolbox,
  TopBar,
  entityIcons,
  dataSourceIcons,
};

// if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
//   global.LunchBadgerUI = LunchBadgerUI;
// }
//
// module.exports = LunchBadgerUI;
