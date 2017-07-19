import tools from './tools';

export default {
  tools,
  quadrants: {
    0: {
      name: 'Backend',
      entities: ['dataSources'],
    },
    1: {
      name: 'Private',
      entities: ['models', 'microservices'],
    },
  },
};
