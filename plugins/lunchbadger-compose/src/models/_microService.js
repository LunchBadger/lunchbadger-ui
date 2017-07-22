import uuid from 'uuid';

const initialModel = {
  data: {
    itemOrder: 0,
    name: '',
    models: [],
  },
  metadata: {
    type: 'Microservice',
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
