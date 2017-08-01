import uuid from 'uuid';

const portGroups = LunchBadgerCore.constants.portGroups;

const initialModel = {
  name: '',
  policies: [],
  metadata: {
    ports: [],
  },
}

export default {
  create: (model, metadata) => {
    const id = model.id || uuid.v4();
    return {
      ...initialModel.data,
      ...model,
      id,
      metadata: {
        ...initialModel.metadata,
        ports: [
          {
            id,
            portGroup: portGroups.GATEWAYS,
            portType: 'in',
          },
          {
            id,
            portGroup: portGroups.PUBLIC,
            portType: 'out',
          },
        ],
        ...metadata,
        id,
      },
    };
  },
};
