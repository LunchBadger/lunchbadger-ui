import uuid from 'uuid';

const initialModel = {
  name: '',
  icon: '',
  tiers: [],
  details: [],
  metadata: {
    type: 'APIPlan',
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
  // toJSON: entity => {
  //   const json = {...entity};
  //   delete json.metadata;
  //   return json;
  // },
  // validate: (entity, model, state) => {
  //   const invalid = {};
  //   const {messages, checkFields} = LunchBadgerCore.utils;
  //   if (model.name !== '') {
  //     const isDuplicateName = Object.keys(state.entities.apis)
  //       .filter(id => id !== entity.metadata.id)
  //       .filter(id => state.entities.apis[id].name.toLowerCase() === model.name.toLowerCase())
  //       .length > 0;
  //     if (isDuplicateName) {
  //       invalid.name = messages.duplicatedEntityName('API');
  //     }
  //   }
  //   const fields = ['name'];
  //   checkFields(fields, model, invalid);
  //   return invalid;
  // },
};
