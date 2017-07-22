import uuid from 'uuid';

const initialModel = {
  data: {
    dnsPrefix: '',
    itemOrder: 0,
    name: '',
    pipelines: [],
  },
  metadata: {
    type: 'Gateway',
    loaded: true,
    ready: true,
  },
}

export default {
  create: (model, metadata) => ({
    data: {
      ...initialModel.data,
      ...model,
      id: model.id || uuid.v4(),
    },
    metadata: {
      ...initialModel.metadata,
      ...metadata,
    },
  }),
};
