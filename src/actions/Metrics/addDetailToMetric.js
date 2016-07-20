import MetricDetail from 'models/MetricDetail';
import {getRandomInt} from 'models/Metric';
import moment from 'moment';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (metric, title, type) => {
  dispatch('AddDetailToMetric', {
    metric,
    detail: MetricDetail.create({
      title,
      type,
      value: getRandomInt(1000, 200000),
      dateFrom: moment(),
      dateTo: moment().add(1, 'months')
    })
  });
}
