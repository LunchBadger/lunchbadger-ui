import Private from '../../../stores/Private';
import Model from '../../../models/Model';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
const handleFatals = LunchBadgerCore.utils.handleFatals;
const ProjectService = LunchBadgerCore.services.ProjectService;

export default () => {
  let data = Private.getData().filter(entity => entity.reordered);
  let promise = ProjectService.upsertModel(data.filter(entity => entity instanceof Model));
  handleFatals(promise);
  dispatch('SavePrivateOrder');
};
