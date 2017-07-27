import uuid from 'uuid';

const initialModel = {
  data: {
    apis: [],
    itemOrder: 0,
    name: '',
    rootUrl: 'http://',
  },
  metadata: {
    type: 'Portal',
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
        id: model.id || uuid.v4(),
      },
      metadata: {
        ...initialModel.metadata,
        ...metadata,
        id,
      },
    };
  },
};
