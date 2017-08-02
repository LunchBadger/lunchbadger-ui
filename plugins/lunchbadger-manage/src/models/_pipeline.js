import uuid from 'uuid';
import Policy from './_policy';

const portGroups = LunchBadgerCore.constants.portGroups;

const initialModel = {
  name: 'Pipeline',
  policies: [
    {
      name: 'Auth 01',
      type: 'OAuth2',
    },
    {
      name: 'Rate limiter',
      type: 'Rate limit',
    },
    {
      name: 'Logger',
      type: 'Logging',
    },
  ],
  metadata: {
    ports: [],
  },
}

export default {
  create: (model = {}, metadata) => {
    const id = model.id || uuid.v4();
    const policies = model.policies || initialModel.policies;
    return {
      ...initialModel,
      ...model,
      policies: policies.map(item => Policy.create(item)),
      id,
      metadata: {
        ...initialModel.metadata,
        ports: [
          {
            id,
            portGroup: portGroups.GATEWAYS,
            portType: 'in',
          },
          {
            id,
            portGroup: portGroups.PUBLIC,
            portType: 'out',
          },
        ],
        ...metadata,
        id,
      },
    };
  },
};
