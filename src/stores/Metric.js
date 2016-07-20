import _ from 'lodash';

const {BaseStore} = LunchBadgerCore.stores;
const {register} = LunchBadgerCore.dispatcher.AppDispatcher;
let Metrics = [];

class Metric extends BaseStore {
  constructor() {
    super();
    register((action) => {
      switch (action.type) {
        case 'CreateMetric':
          Metrics.push(action.metric);
          this.emitChange();
          break;
        case 'UpdateMetric':
          const entity = this.findEntity(action.metric.id);

          if (entity) {
            entity.update({
              left: action.left,
              top: action.top
            });

            this.emitChange();
          }

          break;
        case 'RemoveMetric':
          _.remove(Metrics, {id: action.metric.id});

          this.emitChange();
          break;
        case 'Aggregate':
          const {bundleOne, bundleTwo} = action;

          if (!bundleTwo.pairs[0].metricTwo) {
            bundleOne.pairs[0].metricTwo = bundleTwo.pairs[0].metricOne;
            _.remove(Metrics, {id: bundleTwo.id});
          } else if (bundleTwo.pairs[0].metricTwo) {
            bundleOne.addMetricPair(bundleTwo.pairs[0]);
            _.remove(Metrics, {id: bundleTwo.id});
          }

          this.emitChange();
          break;
      }
    });
  }

  empty() {
    Metrics = [];
  }

  getData() {
    return Metrics;
  }

  findEntity(id) {
    id = this.formatId(id);

    return _.find(Metrics, {id: id});
  }

  findByEntityId(id) {
    id = this.formatId(id);

    return _.find(Metrics, (bundle) => {
      return _.find(bundle.pairs, (pair) => {
        return (pair.metricOne && pair.metricOne.entity.id === id) || (pair.metricTwo && pair.metricTwo.entity.id === id);
      });
    });
  }
}

export default new Metric;
