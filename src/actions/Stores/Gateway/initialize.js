import Gateway from 'models/Gateway';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (data) => {
  const gateways = data.gateways;

  const gatewayObjects = gateways.map((gateway, index) => {
    return Gateway.create({
      itemOrder: index,
      ready: true,
      loaded: true,
      ...gateway
    });
  });

  dispatch('InitializeGateway', {
    data: gatewayObjects
  });
};
