import uuid from 'uuid';

const portGroups = LunchBadgerCore.constants.portGroups;

const initialModel = {
  itemOrder: 0,
  name: '',
  path: '/endpoint',
  metadata: {
    type: 'PublicEndpoint',
    loaded: true,
    processing: false,
    ports: [],
  },
}

export default {
  create: (model, metadata) => {
    const id = model.id || uuid.v4();
    return {
      ...initialModel,
      ...model,
      id,
      metadata: {
        ...initialModel.metadata,
        ports: [
          {
            id,
            portGroup: portGroups.PUBLIC,
            portType: 'in',
          },
        ],
        ...metadata,
        id,
      },
    };
  },
  toJSON: entity => {
    const json = {...entity};
    delete json.metadata;
    return json;
  },
  validate: (entity, model, state) => {
    const invalid = {};
    // const {messages, checkFields} = LunchBadgerCore.utils;
    // if (model.name !== '') {
    //   const isDuplicateName = Object.keys(state.entities.dataSources)
    //     .filter(id => id !== entity.metadata.id)
    //     .filter(id => state.entities.dataSources[id].name.toLowerCase() === model.name.toLowerCase())
    //     .length > 0;
    //   if (isDuplicateName) {
    //     invalid.name = messages.duplicatedEntityName('Data Source');
    //   }
    // }
    // const fields = ['name', 'url', 'database', 'username', 'password'];
    // checkFields(fields, model, invalid);
    return invalid;
  },
};
