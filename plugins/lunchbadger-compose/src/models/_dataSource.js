import uuid from 'uuid';
import _ from 'lodash';

const portGroups = LunchBadgerCore.constants.portGroups;

const initialModel = {
  facetName: 'server',
  name: '',
  connector: '',
  url: '',
  database: '',
  username: '',
  password: '',
  itemOrder: 0,
  metadata: {
    type: 'DataSource',
    loaded: true,
    processing: false,
    ports: [],
  },
}

export default {
  create: (model, metadata) => {
    const id = model.lunchbadgerId || uuid.v4();
    return {
      ...initialModel,
      ...model,
      id: `server.${model.name}`,
      lunchbadgerId: id,
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
        id,
      },
    };
  },
  toJSON: entity => {
    const json = _.merge({}, entity);
    delete json.metadata;
    return json;
  },
  validate: (entity, model, state) => {
    const invalid = {};
    const {messages, checkFields} = LunchBadgerCore.utils;
    if (model.name !== '') {
      const isDuplicateName = Object.keys(state.entities.dataSources)
        .filter(id => id !== entity.metadata.id)
        .filter(id => state.entities.dataSources[id].name.toLowerCase() === model.name.toLowerCase())
        .length > 0;
      if (isDuplicateName) {
        invalid.name = messages.duplicatedEntityName('Data Source');
      }
    }
    const fields = ['name', 'url', 'database', 'username', 'password'];
    checkFields(fields, model, invalid);
    return invalid;
  },
};
