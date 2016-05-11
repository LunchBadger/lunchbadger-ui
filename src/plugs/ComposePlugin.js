import DataSource from '../components/Tools/DataSource';
import Model from '../components/Tools/Model';
import Backend from '../stores/Backend';
import BackendQuadrant from '../components/Quadrant/BackendQuadrant';
import PrivateQuadrant from '../components/Quadrant/PrivateQuadrant';
import DataSourceDetails from '../components/Panel/EntitiesDetails/DataSourceDetails';
import ModelDetails from '../components/Panel/EntitiesDetails/ModelDetails';
import DataSourceFactory from '../models/DataSource';

import {handleConnectionCreate, handleConnectionMove} from '../strategies/connectionBetweenModelAndDataSource';

const Private = LunchBadgerManage.stores.Private;
const composePlugin = new LunchBadgerCore.models.Plugin('ComposePlugin');
const toolGroupComponent = LunchBadgerCore.components.ToolGroup;
const ModelFactory = LunchBadgerManage.models.Model;

const tools = [
  new LunchBadgerCore.models.ToolComponent(DataSource),
  new LunchBadgerCore.models.ToolComponent(Model)
];
const toolGroup = [
  new LunchBadgerCore.models.ToolGroupComponent('compose', toolGroupComponent, tools, 5)
];

const quadrants = [
  new LunchBadgerCore.models.QuadrantComponent('Backend', BackendQuadrant, Backend, 0),
  new LunchBadgerCore.models.QuadrantComponent('Private', PrivateQuadrant, Private, 1, true)
];

const detailsPanels = [
  new LunchBadgerCore.models.PanelDetailsComponent(DataSourceFactory.type, DataSourceDetails),
  new LunchBadgerCore.models.PanelDetailsComponent(ModelFactory.type, ModelDetails)
];

composePlugin.registerToolGroup(toolGroup);
composePlugin.registerQuadrants(quadrants);
composePlugin.registerDetailsPanels(detailsPanels);
composePlugin.registerOnConnectionCreatedStrategy(handleConnectionCreate);
composePlugin.registerOnConnectionMovedStrategy(handleConnectionMove);

export default composePlugin;
