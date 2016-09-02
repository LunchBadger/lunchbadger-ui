import Gateway from '../../../models/Gateway';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (name) => {
  const gateway = Gateway.create({
    name: name || 'Gateway'
  });

  setTimeout(() => {
    dispatch('DeployGatewaySuccess', {
      gateway
    });
  }, 1500);

  dispatch('DeployGateway', {
    gateway
  });
};
