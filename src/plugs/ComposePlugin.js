import DataSource from '../components/Tools/DataSource';
import Model from '../components/Tools/Model';

const toolsPlugin = new LunchBadgerCore.models.Plugin('BaseTools');
const toolGroupComponent = LunchBadgerCore.components.ToolGroup;

const tools = [
  new LunchBadgerCore.models.ToolComponent(DataSource),
  new LunchBadgerCore.models.ToolComponent(Model)
];
const toolGroup = new LunchBadgerCore.models.ToolGroupComponent(toolGroupComponent, tools);

toolsPlugin.registerToolGroup(toolGroup, 5);

export default toolsPlugin;
