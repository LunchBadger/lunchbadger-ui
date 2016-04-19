import {dispatch} from 'dispatcher/AppDispatcher';
import Gateway from 'models/Gateway';

export default (name) => {
  const gateway = Gateway.create({
    name: name || 'Gateway'
  });

  setTimeout(() => {
    dispatch('DeployGatewaySuccess', {
      gateway
    });
  }, 50);

  dispatch('DeployGateway', {
    gateway
  });
};
