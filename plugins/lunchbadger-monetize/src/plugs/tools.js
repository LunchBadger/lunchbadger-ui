import {add as addAPI} from '../reduxActions/apis';
import {add as addPortal} from '../reduxActions/portals';

const {utils: {Config}} = LunchBadgerCore;

const tools = {2: []};

if (Config.get('features').apis) {
  tools[2].push({
    name: 'api',
    icon: 'iconApi',
    tooltip: 'API',
    action: addAPI,
  });
}

if (Config.get('features').portals) {
  tools[2].push({
    name: 'portal',
    icon: 'iconPortal',
    tooltip: 'Portal',
    action: addPortal,
  });
}

export default tools;
