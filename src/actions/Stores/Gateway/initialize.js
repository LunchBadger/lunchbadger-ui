import Gateway from 'models/Gateway';
import Pipeline from 'models/Pipeline';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (data) => {
  const gateways = data.gateways;

  const gatewayObjects = gateways.map((gateway, index) => {
    // remove pipelines before de-serializing data but first save it somewhere
    const embeddedPipelines = gateway.pipelines;
    delete gateway.pipelines;

    const gatewayEntity = Gateway.create({
      itemOrder: index,
      ready: true,
      loaded: true,
      ...gateway
    });

    embeddedPipelines.forEach((pipeline) => {
      gatewayEntity.addPipeline(Pipeline.create(pipeline));
    });

    return gatewayEntity;
  });

  dispatch('InitializeGateway', {
    data: gatewayObjects
  });
};
