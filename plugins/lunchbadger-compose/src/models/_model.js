import uuid from 'uuid';

const portGroups = LunchBadgerCore.constants.portGroups;

const initialModel = {
  base: '',
  facetName: 'server',
  http: {
    path: 'newmodel',
  },
  itemOrder: 0,
  name: 'NewModel',
  plurar: '',
  properties: [],
  public: true,
  readonly: false,
  relations: [],
  strict: false,
  wasBundled: false,
  metadata: {
    type: 'Model',
    loaded: true,
    processing: false,
    top: 0,
    left: 0,
  },
};

export default {
  create: (model, metadata) => {
    const id = model.lunchbadgerId || uuid.v4();
    const name = model.name || initialModel.name;
    return {
      ...initialModel,
      ...model,
      id: `server.${name}`,
      lunchbadgerId: id,
      metadata: {
        ...initialModel.metadata,
        ports: [
          {
            id,
            portGroup: portGroups.PRIVATE,
            portType: 'in',
          },
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
  toJSON: entity => {
    const json = {...entity};
    delete json.metadata;
    return json;
  },
  validate: (entity, model, state) => {
    const invalid = {};
    const {messages, checkFields} = LunchBadgerCore.utils;
    if (model.name !== '') {
      const isDuplicateName = Object.keys(state.entities.models)
        .filter(id => id !== entity.metadata.id)
        .filter(id => state.entities.models[id].name.toLowerCase() === model.name.toLowerCase())
        .length > 0;
      if (isDuplicateName) {
        invalid.name = messages.duplicatedEntityName('Model');
      }
    }
    const fields = ['name'];
    checkFields(fields, model, invalid);
    if (model.name.toLowerCase() === 'model') invalid.name = 'Model name cannot be "Model"';
    if ((/\s/g).test(model.name)) invalid.name = 'Model name cannot have spaces';
    if (model.http.path === '') {
      invalid.contextPath = messages.fieldCannotBeEmpty;
    }
    return invalid;
  },
};
