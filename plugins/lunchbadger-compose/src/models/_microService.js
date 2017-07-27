import uuid from 'uuid';

const initialModel = {
  data: {
    itemOrder: 0,
    name: 'Microservice',
    models: [],
  },
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
      data: {
        ...initialModel.data,
        ...model,
        id,
      },
      metadata: {
        ...initialModel.metadata,
        ...metadata,
        id,
      },
    };
  },
  validate: ({data, metadata}, model, state) => {
    const invalid = {};
    const {messages, checkFields} = LunchBadgerCore.utils;
    if (model.name !== '') {
      const isDuplicateName = Object.keys(state.entities.microservices)
        .filter(id => id !== metadata.id)
        .filter(id => state.entities.microservices[id].data.name.toLowerCase() === model.name.toLowerCase())
        .length > 0;
      if (isDuplicateName) {
        invalid.name = messages.duplicatedEntityName('Microservice');
      }
    }
    checkFields(['name'], model, invalid);
    return invalid;
  },
};
