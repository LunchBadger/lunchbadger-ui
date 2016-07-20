import _ from 'lodash';

const BaseModel = LunchBadgerCore.models.BaseModel;

export default class MetricBundle extends BaseModel {
  static type = 'MetricBundle';

  /**
   * @type {MetricPair[]}
   * @private
   */
  _pairs = [];

  constructor(id, metrics) {
    super(id);

    this.metrics = metrics;
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

  /**
   * @param pair {MetricPair}
   */
  addMetricPair(pair) {
    if (!_.find(this.metrics, {id: pair.id})) {
      this._metrics.push(pair);
    }
  }
}
