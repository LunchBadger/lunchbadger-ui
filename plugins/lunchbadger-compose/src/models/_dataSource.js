import uuid from 'uuid';

const portGroups = LunchBadgerCore.constants.portGroups;

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
    loaded: true,
    ready: true,
    ports: [],
  },
}

export default {
  create: (model, metadata) => {
    const id = model.lunchbadgerId || uuid.v4();
    return {
      data: {
        ...initialModel.data,
        ...model,
        id: `server.${model.name}`,
        lunchbadgerId: id,
      },
      metadata: {
        ...initialModel.metadata,
        ports: [
          {
            id,
            portGroup: portGroups.PRIVATE,
            portType: 'out',
          },
        ],
        ...metadata,
      },
    };
  }
};
