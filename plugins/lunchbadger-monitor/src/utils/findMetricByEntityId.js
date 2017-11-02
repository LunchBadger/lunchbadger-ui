import _ from 'lodash';
const {storeUtils} = LunchBadgerCore.utils;

export default (metrics, id) => {
  id = storeUtils.formatId(id);
  return _.find(Object.keys(metrics).map(key => metrics[key]), (bundle) => {
    if (bundle.entityId && bundle.entityId === id) return true;
    return _.find(bundle.pairs, (pair) => {
      return (pair.metricOne && pair.metricOne.entity.id === id) || (pair.metricTwo && pair.metricTwo.entity.id === id);
    });
  });
};
