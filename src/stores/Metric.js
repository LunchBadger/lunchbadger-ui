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

        case 'AddDetailToMetric':
          action.metric.addDetail(action.detail);

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

    return _.find(Metrics, (metric) => {
      return metric.entity.id === id;
    });
  }
}

export default new Metric;
