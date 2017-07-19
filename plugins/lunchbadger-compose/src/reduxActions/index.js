export const addDataSource = (name, connector) => ({
  type: 'ADD_DATASOURCE',
  name,
  connector,
});

export const addModel = name => ({
  type: 'ADD_MODEL',
  name,
});
