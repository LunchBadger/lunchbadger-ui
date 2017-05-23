import {dispatch} from '../../dispatcher/AppDispatcher';

export default (entity) => {
  if (entity.constructor.type = LunchBadgerMonetize.models.API.type) {
    dispatch('RemoveAPIForecast', {
      id: entity.id
    });
  }
  dispatch('RemoveEntity', {
    entity
  });
}
