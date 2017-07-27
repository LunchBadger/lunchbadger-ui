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
      },
      metadata: {
        ...initialModel.metadata,
        ...metadata,
        id,
      },
    };
  },
};
