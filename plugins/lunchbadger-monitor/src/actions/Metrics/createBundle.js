import Metric from '../../models/Metric';
import MetricBundle from '../../models/MetricBundle';
import MetricPair, {OR} from '../../models/MetricPair';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (items, left, top) => {
  let pairs = [];

  if (items.length === 1) {
    pairs = [
      MetricPair.create({
        metricOne: Metric.create({entity: items[0]}),
        type: OR
      })
    ];
  }

  if (items.length === 2) {
    pairs = [
      MetricPair.create({
        metricOne: Metric.create({entity: items[0]}),
        metricTwo: Metric.create({entity: items[1]}),
        type: OR
      })
    ];
  }

  if (items.length === 4) {
    pairs = [
      MetricPair.create({
        metricOne: Metric.create({entity: items[0]}),
        metricTwo: Metric.create({entity: items[1]}),
        type: OR
      }),
      MetricPair.create({
        metricOne: Metric.create({entity: items[2]}),
        metricTwo: Metric.create({entity: items[3]}),
        type: OR
      })
    ];
  }

  pairs && dispatch('CreateMetric', {
    metric: MetricBundle.create({
      pairs: pairs,
      left: left || 0,
      top: top || 0
    })
  });
}
