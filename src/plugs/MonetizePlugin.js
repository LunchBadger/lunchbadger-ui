import API from '../components/Tools/API';

const composePlugin = new LunchBadgerCore.models.Plugin('MonetizePlugin');
const toolGroupComponent = LunchBadgerCore.components.ToolGroup;

const tools = [
  new LunchBadgerCore.models.ToolComponent(API)
];
const toolGroup = new LunchBadgerCore.models.ToolGroupComponent(toolGroupComponent, tools);

composePlugin.registerToolGroup(toolGroup, 10);

export default composePlugin;
