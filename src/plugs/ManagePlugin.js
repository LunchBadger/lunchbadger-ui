import Gateway from '../components/Tools/Gateway';
import GatewayQuadrant from '../components/Quadrants/GatewayQuadrant';
import GatewayStore from '../stores/Gateway';
import PrivateQuadrant from '../components/Quadrants/PrivateQuadrant';

const Private = LunchBadgerCompose.stores.Private;
const managePlugin = new LunchBadgerCore.models.Plugin('ManagePlugin');
const toolGroupComponent = LunchBadgerCore.components.ToolGroup;

const tools = [
  new LunchBadgerCore.models.ToolComponent(Gateway)
];
const toolGroup = new LunchBadgerCore.models.ToolGroupComponent(toolGroupComponent, tools);

const quadrants = [
  new LunchBadgerCore.models.QuadrantComponent('Private', PrivateQuadrant, Private, 1, true),
  new LunchBadgerCore.models.QuadrantComponent('Gateway', GatewayQuadrant, GatewayStore, 2)
];

managePlugin.registerToolGroup(toolGroup, 4);
managePlugin.registerQuadrants(quadrants);

export default managePlugin;
