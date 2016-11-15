import Backend from '../../../stores/Backend';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (service) => {
  let data = Backend.getData().filter(entity => entity.reordered);
  service.upsertDataSource(data);
  dispatch('SaveBackendOrder');
};
