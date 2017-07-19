import Backend from '../../../stores/Backend';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
const handleFatals = LunchBadgerCore.utils.handleFatals;
const ProjectService = LunchBadgerCore.services.ProjectService;

export default () => {
  let data = Backend.getData().filter(entity => entity.reordered);
  handleFatals(ProjectService.upsertDataSource(data));
  dispatch('SaveBackendOrder');
};
