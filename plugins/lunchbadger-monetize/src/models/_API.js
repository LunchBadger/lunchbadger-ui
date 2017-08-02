import uuid from 'uuid';

const {PublicEndpoint} = LunchBadgerManage.models;

const initialModel = {
  name: 'API',
  itemOrder: 0,
  plans: [],
  publicEndpoints: [],
  metadata: {
    type: 'API',
    loaded: true,
    processing: false,
    top: 0,
    left: 0,
  },
}

export default {
  create: (model, metadata) => {
    const id = model.id || uuid.v4();
    const publicEndpoints = model.publicEndpoints || initialModel.publicEndpoints;
    return {
      ...initialModel,
      ...model,
      publicEndpoints: publicEndpoints.map(item => PublicEndpoint.create(item)),
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
      const isDuplicateName = Object.keys(state.entities.apis)
        .filter(id => id !== entity.metadata.id)
        .filter(id => state.entities.apis[id].name.toLowerCase() === model.name.toLowerCase())
        .length > 0;
      if (isDuplicateName) {
        invalid.name = messages.duplicatedEntityName('API');
      }
    }
    const fields = ['name'];
    checkFields(fields, model, invalid);
    return invalid;
  },
};
