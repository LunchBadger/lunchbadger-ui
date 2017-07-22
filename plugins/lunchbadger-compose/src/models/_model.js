import uuid from 'uuid';

const initialModel = {
  data: {
    base: '',
    facetName: 'server',
    http: {
      path: '',
    },
    itemOrder: 0,
    name: '',
    plurar: '',
    properties: [],
    public: true,
    readonly: false,
    relations: [],
    strict: false,
    wasBundled: false,
  },
  metadata: {
    type: 'Model',
    loaded: true,
    ready: true,
    top: 0,
    left: 0,
  },
};

export default {
  create: (model, metadata) => ({
    data: {
      ...initialModel.data,
      ...model,
      id: `server.${model.name}`,
      lunchbadgerId: model.lunchbadgerId || uuid.v4(),
      contextPath: model.name.toLowerCase(),
    },
    metadata: {
      ...initialModel.metadata,
      ...metadata,
    },
  }),
};
