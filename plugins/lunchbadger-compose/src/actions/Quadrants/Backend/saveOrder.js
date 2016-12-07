import Backend from '../../../stores/Backend';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
const handleFatals = LunchBadgerCore.utils.handleFatals;

export default (service) => {
  let data = Backend.getData().filter(entity => entity.reordered);

  handleFatals(service.upsertDataSource(data));

  dispatch('SaveBackendOrder');
};
