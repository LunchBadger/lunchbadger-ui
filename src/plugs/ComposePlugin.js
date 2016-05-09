import DataSource from '../components/Tools/DataSource';
import Model from '../components/Tools/Model';
import Backend from '../stores/Backend';
import Private from '../stores/Private';
import BackendQuadrant from '../components/Quadrant/BackendQuadrant';
import PrivateQuadrant from '../components/Quadrant/PrivateQuadrant';

const composePlugin = new LunchBadgerCore.models.Plugin('ComposePlugin');
const toolGroupComponent = LunchBadgerCore.components.ToolGroup;

const tools = [
  new LunchBadgerCore.models.ToolComponent(DataSource),
  new LunchBadgerCore.models.ToolComponent(Model)
];
const toolGroup = [
  new LunchBadgerCore.models.ToolGroupComponent(toolGroupComponent, tools, 5)
];

const quadrants = [
  new LunchBadgerCore.models.QuadrantComponent('Backend', BackendQuadrant, Backend, 0),
  new LunchBadgerCore.models.QuadrantComponent('Private', PrivateQuadrant, Private, 1)
];

composePlugin.registerToolGroup(toolGroup);
composePlugin.registerQuadrants(quadrants);

export default composePlugin;
