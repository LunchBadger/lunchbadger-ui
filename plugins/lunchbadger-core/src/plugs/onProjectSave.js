const statesToSave = [
  'currentElement',
  'currentlyOpenedPanel',
];

const setStatesToSave = (state) => {
  const states = [];
  statesToSave.forEach((key) => {
    const value = state.states[key];
    if (!state.states.hasOwnProperty(key)) return;
    if (typeof value.toJSON === 'function') {
      states.push({key, value: {...value.toJSON(), type: value.constructor.type}});
    } else {
      states.push({key, value});
    }
  });
  return states;
}

export default [
  state => ({
    name: 'main',
    connections: state.connections,
    states: setStatesToSave(state),
  }),
];
