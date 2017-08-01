import uuid from 'uuid';
import API from './_API';

const initialModel = {
  apis: [],
  itemOrder: 0,
  name: '',
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
    return {
      ...initialModel,
      ...model,
      apis: model.apis.map(item => API.create(item)),
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
