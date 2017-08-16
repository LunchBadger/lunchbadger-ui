import {add as addAPI} from '../reduxActions/apis';
import {add as addPortal} from '../reduxActions/portals';

export default {
  2: [
    {
      name: 'api',
      icon: 'iconApi',
      tooltip: 'API',
      action: addAPI,
    },
    {
      name: 'portal',
      icon: 'iconPortal',
      tooltip: 'Portal',
      action: addPortal,
    },
  ],
};
