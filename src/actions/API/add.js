import APIForecast from 'models/APIForecast';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (entity, left, top) => {
  dispatch('AddAPIForecast', {
    APIForecast: APIForecast.create({
      name: entity.name,
      apiId: entity.id,
      left: left || 0,
      top: top || 0
    })
  });
};
