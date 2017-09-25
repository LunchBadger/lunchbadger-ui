import {add as addServiceEndpoint} from '../reduxActions/serviceEndpoints';
import {add as addPublicEndpoint} from '../reduxActions/publicEndpoints';
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
          label: 'Public',
          name: 'publicendpoint',
          icon: 'iconEndpoint',
          action: addPublicEndpoint,
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
