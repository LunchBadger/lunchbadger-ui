import {add as addAPI} from '../reduxActions/apis';
import {add as addPortal} from '../reduxActions/portals';

export default {
  2: [
    {
      icon: 'iconApi',
      tooltip: 'API',
      action: addAPI,
    },
    {
      icon: 'iconPortal',
      tooltip: 'Portal',
      action: addPortal,
    },
  ],
};
