import DataSource from '../components/Tools/DataSource';
import Model from '../components/Tools/Model';

const toolsPlugin = new LBCore.models.Plugin('BaseTools');
const toolGroupComponent = LBCore.components.ToolGroup;

const tools = [
  new LBCore.models.ToolComponent(DataSource),
  new LBCore.models.ToolComponent(Model)
];
const toolGroup = new LBCore.models.ToolGroupComponent(toolGroupComponent, tools);

toolsPlugin.registerToolGroup(toolGroup, 5);

export default toolsPlugin;
