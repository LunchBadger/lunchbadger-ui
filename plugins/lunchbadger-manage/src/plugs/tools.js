import {addPrivateEndpoint} from '../reduxActions/privateEndpoints';
import {addPublicEndpoint} from '../reduxActions/publicEndpoints';
import {addGateway} from '../reduxActions/gateways';

export default {
  1: [
    {
      icon: 'iconEndpoint',
      tooltip: 'Endpoint',
      plain: true,
      submenu: [
        {
          label: 'Private',
          name: 'privateendpoint',
          icon: 'iconEndpoint',
          action: addPrivateEndpoint,
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
      icon: 'iconGateway',
      tooltip: 'Gateway',
      action: addGateway,
    },
  ],
};
