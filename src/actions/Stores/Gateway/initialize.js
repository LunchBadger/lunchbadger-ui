import Gateway from 'models/Gateway';
import Pipeline from 'models/Pipeline';
import Policy from 'models/Policy';

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

    gatewayEntity.pipelines = embeddedPipelines.map(pipeline => {
      let policies = pipeline.policies || [];
      delete pipeline.policies;

      const pipelineOptions = {...pipeline};

      if (policies.length > 0) {
        pipelineOptions.policies = policies.map(policy => Policy.create(policy));
      }

      return Pipeline.create(pipelineOptions);
    });

    return gatewayEntity;
  });

  dispatch('InitializeGateway', {
    data: gatewayObjects
  });
};
