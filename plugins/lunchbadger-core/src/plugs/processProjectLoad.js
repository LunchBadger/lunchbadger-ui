export default [
  (responses) => {
    const projectConnections = responses[0].body.connections
      .map(({fromId, toId}) => `${fromId}:${toId}`)
      .reduce((map, item) => ({
        ...map,
        [item]: true,
      }), {});
    const dataSources = responses[1][0].body
      .filter(({id}) => id)
      .reduce((map, {name, id}) => ({
        ...map,
        [name]: id,
      }), {});
    const models = responses[1][1].body
      .filter(({lunchbadgerId}) => lunchbadgerId)
      .reduce((map, {name, lunchbadgerId}) => ({
        ...map,
        [name]: lunchbadgerId,
      }), {});
    const loopbackConnections = responses[1][2].body
      .filter(item => item.dataSource)
      .filter(item => dataSources[item.dataSource] && models[item.name])
      .map(item => ({
        fromId: dataSources[item.dataSource],
        toId: models[item.name],
      }))
      .map(({fromId, toId}) => `${fromId}:${toId}`)
      .reduce((map, item) => ({
        ...map,
        [item]: true,
      }), {});
    const states = responses[0].body.states
      .reduce((map, item) => ({...map, [item.key]: item.value}), {});
    const {pendingEdit = {}} = states;
    return {
      connections: {
        ...projectConnections,
        ...loopbackConnections,
      },
      pendingEdit,
    };
  }
];
