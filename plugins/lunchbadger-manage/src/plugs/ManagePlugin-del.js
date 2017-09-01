// import Gateway from '../components/Tools/Gateway';
// import Endpoint from '../components/Tools/Endpoint';
// import GatewayQuadrant from '../components/Quadrants/GatewayQuadrant';
// import PrivateQuadrant from '../components/Quadrants/PrivateQuadrant';
// import PublicQuadrant from '../components/Quadrants/PublicQuadrant';
// import GatewayStore from '../stores/Gateway';
// import Public from '../stores/Public';
// import Private from '../stores/Private';
// import GatewayDetails from '../components/Panel/EntitiesDetails/GatewayDetails';
// import PublicEndpointDetails from '../components/Panel/EntitiesDetails/PublicEndpointDetails';
// import PrivateEndpointDetails from '../components/Panel/EntitiesDetails/PrivateEndpointDetails';
// import PrivateEndpointFactory from '../models/PrivateEndpoint';
// import PublicEndpointFactory from '../models/PublicEndpoint';
// import GatewayFactory from '../models/Gateway';
//
// const managePlugin = new LunchBadgerCore.models.Plugin('ManagePlugin');
// const toolGroupComponent = LunchBadgerCore.components.ToolGroup;
//
// const tools = [
//   new LunchBadgerCore.models.ToolComponent(Endpoint),
//   new LunchBadgerCore.models.ToolComponent(Gateway)
// ];
//
// const toolGroup = [
//   new LunchBadgerCore.models.ToolGroupComponent('manage', toolGroupComponent, tools, 2)
// ];
//
// const quadrants = [
//   new LunchBadgerCore.models.QuadrantComponent('Private', PrivateQuadrant, Private, 1),
//   new LunchBadgerCore.models.QuadrantComponent('Gateway', GatewayQuadrant, GatewayStore, 2),
//   new LunchBadgerCore.models.QuadrantComponent('Public', PublicQuadrant, Public, 3)
// ];
//
// const detailsPanels = [
//   new LunchBadgerCore.models.PanelDetailsComponent(GatewayFactory.type, GatewayDetails),
//   new LunchBadgerCore.models.PanelDetailsComponent(PublicEndpointFactory.type, PublicEndpointDetails),
//   new LunchBadgerCore.models.PanelDetailsComponent(PrivateEndpointFactory.type, PrivateEndpointDetails)
// ];
//
// managePlugin.registerToolGroup(toolGroup);
// managePlugin.registerQuadrants(quadrants);
// managePlugin.registerDetailsPanels(detailsPanels);
//
// export default managePlugin;
