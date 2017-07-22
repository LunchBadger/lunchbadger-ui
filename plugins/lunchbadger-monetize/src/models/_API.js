import uuid from 'uuid';

const initialModel = {
  data: {
    itemOrder: 0,
    plans: [],
    publicEndpoints: [],
  },
  metadata: {
    type: 'API',
    loaded: true,
    ready: true,
    top: 0,
    left: 0,
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
