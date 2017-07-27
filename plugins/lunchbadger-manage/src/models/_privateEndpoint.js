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
    processing: false,
  },
}

export default {
  create: (model, metadata) => {
    const id = model.id || uuid.v4();
    return {
      data: {
        ...initialModel.data,
        ...model,
        id,
        contextPath: model.name.toLowerCase(),
      },
      metadata: {
        ...initialModel.metadata,
        ...metadata,
        id,
      },
    };
  },
};
