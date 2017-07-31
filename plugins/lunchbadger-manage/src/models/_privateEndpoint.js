import uuid from 'uuid';

const portGroups = LunchBadgerCore.constants.portGroups;

const initialModel = {
  data: {
    itemOrder: 0,
    name: 'PrivateEndpoint',
    contextPath: '',
    url: 'https://private/endpoint',
  },
  metadata: {
    type: 'PrivateEndpoint',
    loaded: true,
    processing: false,
    ports: [],
  },
}

export default {
  create: (model, metadata) => {
    const id = model.id || uuid.v4();
    const contextPath = (model.name || initialModel.data.name).toLowerCase();
    return {
      data: {
        ...initialModel.data,
        ...model,
        id,
        contextPath,
      },
      metadata: {
        ...initialModel.metadata,
        ports: [
          {
            id,
            portGroup: portGroups.GATEWAYS,
            portType: 'out',
          },
        ],
        ...metadata,
        id,
      },
    };
  },
  validate: ({data, metadata}, model, state) => {
    const invalid = {};
    const {messages, checkFields} = LunchBadgerCore.utils;
    if (model.name !== '') {
      const isDuplicateName = Object.keys(state.entities.privateEndpoints)
        .filter(id => id !== metadata.id)
        .filter(id => state.entities.privateEndpoints[id].data.name.toLowerCase() === model.name.toLowerCase())
        .length > 0;
      if (isDuplicateName) {
        invalid.name = messages.duplicatedEntityName('Private Endpoint');
      }
    }
    checkFields(['name', 'url'], model, invalid);
    return invalid;
  },
};
