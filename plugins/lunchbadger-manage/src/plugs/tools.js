import {add as addServiceEndpoint} from '../reduxActions/serviceEndpoints';
import {add as addApiEndpoint} from '../reduxActions/apiEndpoints';
import {add as addGateway} from '../reduxActions/gateways';

export default {
  1: [
    {
      name: 'endpoint',
      icon: 'iconEndpoint',
      tooltip: 'Endpoint',
      plain: true,
      submenu: [
        {
          label: 'Service',
          name: 'serviceendpoint',
          icon: 'iconEndpoint',
          action: addServiceEndpoint,
        },
        {
          label: 'API',
          name: 'apiendpoint',
          icon: 'iconEndpoint',
          action: addApiEndpoint,
        },
      ],
    },
    {
      name: 'gateway',
      icon: 'iconGateway',
      tooltip: 'Gateway',
      action: addGateway,
    },
  ],
};
