import Private from '../../../stores/Private';
import Model from '../../../models/Model';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (service) => {
  let data = Private.getData().filter(entity => entity.reordered);
  service.upsertModel(data.filter(entity => entity instanceof Model));
  dispatch('SavePrivateOrder');
};
