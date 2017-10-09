export default {
  0: {
    name: 'Backend',
    entities: ['dataSources'],
    connectionEntities: ['dataSources'],
  },
  1: {
    name: 'Private',
    entities: ['models', 'microservices', 'functions'],
    connectionEntities: ['models', 'modelsBundled', 'microservices', 'functions'],
    serviceEndpointEntities: ['models', 'modelsBundled', 'functions'],
  },
};
