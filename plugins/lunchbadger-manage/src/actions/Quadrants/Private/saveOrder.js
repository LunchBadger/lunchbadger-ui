import Private from '../../../stores/Private';
import Model from '../../../models/Model';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
const handleFatals = LunchBadgerCore.utils.handleFatals;

export default (service) => {
  let data = Private.getData().filter(entity => entity.reordered);

  let promise = service.upsertModel(data.filter(entity => entity instanceof Model));
  handleFatals(promise);

  dispatch('SavePrivateOrder');
};
