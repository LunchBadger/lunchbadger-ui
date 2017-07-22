import uuid from 'uuid';

const initialModel = {
  data: {
    itemOrder: 0,
    name: '',
    url: 'https://private/endpoint',
  },
  metadata: {
    type: 'PrivateEndpoint',
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
      contextPath: model.name.toLowerCase(),
    },
    metadata: {
      ...initialModel.metadata,
      ...metadata,
    },
  }),
};
