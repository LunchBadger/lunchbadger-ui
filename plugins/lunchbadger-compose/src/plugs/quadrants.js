export default {
  0: {
    name: 'Backend',
    entities: ['dataSources'],
    connectionEntities: ['dataSources'],
  },
  1: {
    name: 'Private',
    entities: ['models', 'microservices'],
    connectionEntities: ['models', 'modelsBundled', 'microservices'],
  },
};
