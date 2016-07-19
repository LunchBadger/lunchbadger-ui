import MetricDetails, {SUM, AVG} from './MetricDetails';
import moment from 'moment';

const BaseModel = LunchBadgerCore.models.BaseModel;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class Metric extends BaseModel {
  static type = 'Metric';

  /**
   * @type {any}
   * @private
   */
  _entity = null;

	/**
   * @type {MetricDetails[]}
   * @private
   */
  _details = [];

  constructor(id, entity, left, top) {
    super(id);

    const defaultDetails = [
      MetricDetails.create({
        title: 'Total requests',
        dateFrom: moment(),
        dateTo: moment().add(1, 'months'),
        type: SUM,
        value: getRandomInt(1000, 200000)
      }),
      MetricDetails.create({
        title: 'Total users',
        dateFrom: moment(),
        dateTo: moment().add(1, 'months'),
        type: AVG,
        value: getRandomInt(1000, 200000)
      })
    ];

    this.entity = entity;
    this.left = left;
    this.top = top;
    this.details = defaultDetails;
  }

  toJSON() {
    return {
      id: this.id,
      entity: this.entity.toJSON(),
      left: this.left,
      top: this.top
    }
  }

  get entity() {
    return this._entity;
  }

  set entity(entity) {
    this._entity = entity;
  }

  get details() {
    return this._details;
  }

  set details(details) {
    this._details = details;
  }
}
