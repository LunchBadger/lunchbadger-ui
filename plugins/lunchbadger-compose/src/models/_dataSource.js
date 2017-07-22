import uuid from 'uuid';

const initialModel = {
  data: {
    facetName: 'server',
    name: '',
    connector: '',
    url: '',
    database: '',
    username: '',
    password: '',
    itemOrder: 0,
  },
  metadata: {
    type: 'DataSource',
    loaded: false,
    ready: false,
  },
}

export default {
  create: (model, metadata) => ({
    data: {
      ...initialModel.data,
      ...model,
      id: `server.${model.name}`,
      lunchbadgerId: model.lunchbadgerId || uuid.v4(),
    },
    metadata: {
      ...initialModel.metadata,
      ...metadata,
    },
  }),
};
