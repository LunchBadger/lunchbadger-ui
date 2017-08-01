import uuid from 'uuid';

const initialModel = {
  name: '',
  type: '',
}

export default {
  create: (model) => {
    const id = model.id || uuid.v4();
    return {
      ...initialModel,
      ...model,
      id,
    };
  },
};
