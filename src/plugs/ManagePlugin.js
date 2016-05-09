import Gateway from '../components/Tools/Gateway';
import Endpoint from '../components/Tools/Endpoint';
import GatewayQuadrant from '../components/Quadrants/GatewayQuadrant';
import PrivateQuadrant from '../components/Quadrants/PrivateQuadrant';
import PublicQuadrant from '../components/Quadrants/PublicQuadrant';
import GatewayStore from '../stores/Gateway';
import Public from '../stores/Public';

const Private = LunchBadgerCompose.stores.Private;
const managePlugin = new LunchBadgerCore.models.Plugin('ManagePlugin');
const toolGroupComponent = LunchBadgerCore.components.ToolGroup;

const endpointTools = [
  new LunchBadgerCore.models.ToolComponent(Endpoint)
];
const gatewayTools = [
  new LunchBadgerCore.models.ToolComponent(Gateway)
];
const toolGroup = [
  new LunchBadgerCore.models.ToolGroupComponent('manageEndpoint', toolGroupComponent, endpointTools, 3),
  new LunchBadgerCore.models.ToolGroupComponent('manageGateway', toolGroupComponent, gatewayTools, 4)
];

const quadrants = [
  new LunchBadgerCore.models.QuadrantComponent('Private', PrivateQuadrant, Private, 1, true),
  new LunchBadgerCore.models.QuadrantComponent('Gateway', GatewayQuadrant, GatewayStore, 2),
  new LunchBadgerCore.models.QuadrantComponent('Public', PublicQuadrant, Public, 3)
];

managePlugin.registerToolGroup(toolGroup);
managePlugin.registerQuadrants(quadrants);

export default managePlugin;
