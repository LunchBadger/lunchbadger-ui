import tools from './tools';

export default {
  tools,
  quadrants: {
    1: {
      name: 'Private',
      entities: ['privateEndpoints'],
    },
    2: {
      name: 'Gateway',
      entities: ['gateways'],
    },
    3: {
      name: 'Public',
      entities: ['publicEndpoints'],
    },
  },
};
