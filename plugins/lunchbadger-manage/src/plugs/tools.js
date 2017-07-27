import {addPrivateEndpoint} from '../reduxActions/privateEndpoints';
// import DeployGateway from '../actions/CanvasElements/Gateway/deploy';
// import AddPrivateEndpoint from '../actions/CanvasElements/PrivateEndpoint/add';
// import AddPublicEndpoint from '../actions/CanvasElements/PublicEndpoint/add';

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
          action: () => AddPublicEndpoint(),
        },
      ],
    },
    {
      icon: 'iconGateway',
      tooltip: 'Gateway',
      action: () => DeployGateway(),
    },
  ],
};
