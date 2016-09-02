import MetricDetail, {USERS, REQUESTS, APPS, PORTALS} from './MetricDetail';
import moment from 'moment';
import _ from 'lodash';

const BaseModel = LunchBadgerCore.models.BaseModel;

export function getRandomInt(min, max) {
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
   * @type {MetricDetail[]}
   * @private
   */
  _details = [];

  constructor(id, entity) {
    super(id);

    const defaultDetails = [
      MetricDetail.create({
        title: REQUESTS,
        dateFrom: moment(),
        dateTo: moment().add(1, 'months'),
        value: getRandomInt(1000, 200000)
      }),
      MetricDetail.create({
        title: USERS,
        dateFrom: moment(),
        dateTo: moment().add(1, 'months'),
        value: getRandomInt(1000, 200000)
      }),
      MetricDetail.create({
        title: APPS,
        dateFrom: moment(),
        dateTo: moment().add(1, 'months'),
        value: getRandomInt(1000, 200000)
      }),
      MetricDetail.create({
        title: PORTALS,
        dateFrom: moment(),
        dateTo: moment().add(1, 'months'),
        value: getRandomInt(1000, 200000)
      })
    ];

    this.entity = entity;
    this.details = defaultDetails;
  }

  toJSON() {
    return {
      id: this.id,
      entity: this.entity.toJSON(),
      details: this.details.map(detail => detail.toJSON())
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

	/**
   * @param detail {MetricDetail}
   */
  addDetail(detail) {
    if (!_.find(this.details, {title: detail.title})) {
      this._details.push(detail);
    }
  }

  getDetail(key) {
    return _.find(this.details, {title: key});
  }
}
