import uuid from 'uuid';

const portGroups = LunchBadgerCore.constants.portGroups;

const initialModel = {
  data: {
    base: '',
    facetName: 'server',
    http: {
      path: '',
    },
    itemOrder: 0,
    name: '',
    plurar: '',
    properties: [],
    public: true,
    readonly: false,
    relations: [],
    strict: false,
    wasBundled: false,
  },
  metadata: {
    type: 'Model',
    loaded: true,
    ready: true,
    editable: false,
    top: 0,
    left: 0,
  },
};

export default {
  create: (model, metadata) => {
    const id = model.lunchbadgerId || uuid.v4();
    return {
      data: {
        ...initialModel.data,
        ...model,
        id: `server.${model.name}`,
        lunchbadgerId: id,
        contextPath: model.name.toLowerCase(),
      },
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
      },
    };
  },
};
