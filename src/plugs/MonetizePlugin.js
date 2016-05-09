import API from '../components/Tools/API';
import PublicQuadrant from '../components/Quadrants/PublicQuadrant';

const monetizePlugin = new LunchBadgerCore.models.Plugin('MonetizePlugin');
const toolGroupComponent = LunchBadgerCore.components.ToolGroup;
const Public = LunchBadgerManage.stores.Public;

const tools = [
  new LunchBadgerCore.models.ToolComponent(API)
];
const toolGroup = [
  new LunchBadgerCore.models.ToolGroupComponent('monetize', toolGroupComponent, tools, 10)
];

const quadrants = [
  new LunchBadgerCore.models.QuadrantComponent('Public', PublicQuadrant, Public, 3, true)
];

monetizePlugin.registerToolGroup(toolGroup);
monetizePlugin.registerQuadrants(quadrants);

export default monetizePlugin;
