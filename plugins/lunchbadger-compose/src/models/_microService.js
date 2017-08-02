import uuid from 'uuid';
import _ from 'lodash';

const initialModel = {
  itemOrder: 0,
  name: 'Microservice',
  models: [],
  metadata: {
    type: 'Microservice',
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
      id,
      metadata: {
        ...initialModel.metadata,
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
      const isDuplicateName = Object.keys(state.entities.microservices)
        .filter(id => id !== entity.metadata.id)
        .filter(id => state.entities.microservices[id].name.toLowerCase() === model.name.toLowerCase())
        .length > 0;
      if (isDuplicateName) {
        invalid.name = messages.duplicatedEntityName('Microservice');
      }
    }
    const fields = ['name'];
    checkFields(fields, model, invalid);
    return invalid;
  },
};
