import Aside from './Aside/Aside';
import Tool from './Aside/Tool/Tool';
import Button from './Button/Button';
import CollapsibleProperties from './CollapsibleProperties/CollapsibleProperties';
import IconSVG from './IconSVG/IconSVG';
import Toolbox from './Toolbox/Toolbox';
import ContextualInformationMessage from './ContextualInformationMessage/ContextualInformationMessage';
import ContextualMenu from './ContextualMenu/ContextualMenu';
import SystemDefcon1 from './SystemDefcon1/SystemDefcon1';
import SystemInformationMessages from './SystemInformationMessages/SystemInformationMessages';
import SystemNotifications from './SystemNotifications/SystemNotifications';
import TooltipWrapper from './TooltipWrapper/TooltipWrapper';
import TopBar from './Header/TopBar/TopBar';
import PanelBar from './Header/PanelBar/PanelBar';

import Entity from './Entity/Entity';
import EntityProperties from './Entity/EntityProperties/EntityProperties';
import EntityProperty from './Entity/EntityProperty/EntityProperty';
import EntityPropertyLabel from './Entity/EntityPropertyLabel/EntityPropertyLabel';
import EntitySubElements from './Entity/EntitySubElements/EntitySubElements';
import EntityValidationErrors from './Entity/EntityValidationErrors/EntityValidationErrors';

import Input from './Form/Input';
import Checkbox from './Form/Checkbox';

import SmoothCollapse from './utils/SmoothCollapse/SmoothCollapse';
import {Form} from './utils/Formsy/main';

import {
  iconApi,
  iconDataSource,
  iconEndpoint,
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
  iconDataSourceEthereum,
  iconDataSourceSalesforce,
} from '../../../src/icons';

const entityIcons = {
  API: iconApi,
  DataSource: iconDataSource,
  Gateway: iconGateway,
  Microservice: iconMicroservice,
  Model: iconModel,
  Portal: iconPortal,
  PrivateEndpoint: iconEndpoint,
  PublicEndpoint: iconEndpoint,
};

const dataSourceIcons = {
  Memory: iconDataSourceMemory,
  REST: iconDataSourceREST,
  SOAP: iconDataSourceSOAP,
  MongoDB: iconDataSourceMongoDB,
  Redis: iconDataSourceRedis,
  MySQL: iconDataSourceMySQL,
  Ethereum: iconDataSourceEthereum,
  Salesforce: iconDataSourceSalesforce,
};

export {
  Aside,
  Button,
  Checkbox,
  CollapsibleProperties,
  ContextualInformationMessage,
  ContextualMenu,
  Entity,
  EntityProperties,
  EntityProperty,
  EntityPropertyLabel,
  EntitySubElements,
  EntityValidationErrors,
  Form,
  IconSVG,
  Input,
  PanelBar,
  SmoothCollapse,
  SystemDefcon1,
  SystemInformationMessages,
  SystemNotifications,
  Tool,
  Toolbox,
  TooltipWrapper,
  TopBar,
  entityIcons,
  dataSourceIcons,
};

// if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
//   global.LunchBadgerUI = LunchBadgerUI;
// }
//
// module.exports = LunchBadgerUI;
