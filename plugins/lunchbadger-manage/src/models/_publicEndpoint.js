import uuid from 'uuid';

const initialModel = {
  data: {
    itemOrder: 0,
    name: '',
    path: '/endpoint',
  },
  metadata: {
    type: 'PublicEndpoint',
    loaded: true,
    ready: true,
    editable: false,
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
