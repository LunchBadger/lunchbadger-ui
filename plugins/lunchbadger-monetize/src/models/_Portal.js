import uuid from 'uuid';
import API from './_API';

const initialModel = {
  name: 'Portal',
  apis: [],
  itemOrder: 0,
  rootUrl: 'http://',
  metadata: {
    type: 'Portal',
    loaded: true,
    processing: false,
  },
}

export default {
  create: (model, metadata) => {
    const id = model.id || uuid.v4();
    const apis = model.apis || initialModel.apis;
    return {
      ...initialModel,
      ...model,
      apis: apis.map(item => API.create(item)),
      id,
      metadata: {
        ...initialModel.metadata,
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
    const {messages, checkFields} = LunchBadgerCore.utils;
    if (model.name !== '') {
      const isDuplicateName = Object.keys(state.entities.portals)
        .filter(id => id !== entity.metadata.id)
        .filter(id => state.entities.portals[id].name.toLowerCase() === model.name.toLowerCase())
        .length > 0;
      if (isDuplicateName) {
        invalid.name = messages.duplicatedEntityName('Portal');
      }
    }
    const fields = ['name', 'rootUrl'];
    checkFields(fields, model, invalid);
    return invalid;
  },
};
