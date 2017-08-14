const statesToSave = [
  'currentElement',
  'currentlyOpenedPanel',
];

const setStatesToSave = (state) => {
  const states = [];
  statesToSave.forEach((key) => {
    if (!state.states.hasOwnProperty(key)) return;
    const value = state.states[key];
    if (typeof value === 'undefined' || value === null) return;
    if (value && value.toJSON && typeof value.toJSON === 'function') {
      states.push({key, value: {...value.toJSON(), type: value.constructor.type}});
    } else {
      states.push({key, value});
    }
  });
  const {currentForecast, currentForecastInformation} = state.states;
  if (currentForecast) {
    states.push({
      key: 'currentForecast',
      value: {
        id: currentForecast.forecast.id,
        expanded: currentForecast.expanded || false,
        left: currentForecast.forecast.left || 0,
        top: currentForecast.forecast.top || 0,
        selectedDate: currentForecast.selectedDate,
      },
    });
  }
  if (currentForecastInformation) {
    states.push({
      key: 'currentForecastInformation',
      value: currentForecastInformation,
    });
  }
  return states;
}

export default [
  state => ({
    name: 'main',
    connections: state.connections,
    states: setStatesToSave(state),
  }),
];
