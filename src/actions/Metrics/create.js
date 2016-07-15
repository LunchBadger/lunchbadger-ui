import Metric from 'models/Metric';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (entity, left, top) => {
  dispatch('CreateMetric', {
    metric: Metric.create({
      entity,
      left: left || 0,
      top: top || 0
    })
  });
}
