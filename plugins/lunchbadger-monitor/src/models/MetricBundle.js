import _ from 'lodash';
import {APPS, USERS, REQUESTS, PORTALS} from './MetricDetail';

const BaseModel = LunchBadgerCore.models.BaseModel;

export default class MetricBundle extends BaseModel {
  static type = 'MetricBundle';

  /**
   * @type {MetricPair[]}
   * @private
   */
  _pairs = [];

  constructor(id, pairs = []) {
    super(id);
    this.pairs = pairs;
  }

  recreate() {
    return MetricBundle.create(this);
  }

  toJSON() {
    return {
      id: this.id,
      pairs: this.pairs.map(metric => metric.toJSON()),
      left: this.left,
      top: this.top
    }
  }

  get pairs() {
    return this._pairs;
  }

  set pairs(pairs) {
    this._pairs = pairs;
  }

  get metrics() {
    return this._pairs.reduce((metrics, pair) => {
      if (pair.metrics.length > 0) return metrics.concat(pair.metrics);
      return metrics;
    }, []);
  }

  /**
   * @param pair {MetricPair}
   */
  addMetricPair(pair) {
    if (!_.find(this.metrics, {id: pair.id})) {
      this._pairs.push(pair);
    }
  }

  getDetailsSummary() {
    const summary = {
      [APPS]: 0,
      [USERS]: 0,
      [REQUESTS]: 0,
      [PORTALS]: 0
    };
    this.pairs.forEach((pair) => {
      const pairSummary = pair.summarizePairDetails();

      Object.keys(summary).forEach((key) => {
        summary[key] += pairSummary[key];
      });
    });
    return summary;
  }

  findPair(id) {
    return _.find(this.pairs, {id});
  }

}
