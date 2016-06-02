import _ from 'lodash';
import ForecastTier from './ForecastTier';

const APIPlan = LunchBadgerMonetize.models.APIPlan;

export default class ForecastAPIPlan extends APIPlan {
  static type = 'ForecastAPIPlan';

  /**
   * @type {ForecastTier[]}
   * @private
   */
  _tiers = [];

	/**
   * @type {boolean}
   * @private
   */
  _changed = false;

  constructor(id, name, icon, changed) {
    super(id);

    this.name = name;
    this.icon = icon;
    this.changed = changed || false;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      icon: this.icon,
      changed: this.changed,
      tiers: this.tiers.map((tier) => {
        return tier.toJSON()
      }),
      details: this.details.map((detail) => {
        return detail.toJSON()
      })
    }
  }

  set changed(changed) {
    this._changed = changed;
  }

  get changed() {
    return this._changed;
  }

  /**
   * @param tiers {ForecastTier[]}
   */
  set tiers(tiers) {
    this._tiers = tiers.map((tier) => {
      if (tier.constructor.type === ForecastTier.type) {
        return tier;
      }

      return ForecastTier.create(tier);
    });
  }

  /**
   * @returns {ForecastTier[]}
   */
  get tiers() {
    return this._tiers;
  }

  /**
   * @param details {PlanDetails}
   */
  addPlanDetails(details) {
    this.details.push(details);
  }

  /**
   * @param date {moment}
   * @returns {Array}
   */
  checkPlanDetailsExistence(date) {
    return _.filter(this.details, (detail) => {
      return detail.date === date.format('M/YYYY');
    }).length;
  }

	/**
   * @param params - parameters from PlanDetails object
   * @returns {PlanDetails|undefined}
   */
  findDetail(params) {
    return _.find(this.details, params);
  }

	/**
   * @param date {String} - date in string type with format M/YYYY
   * @returns {Array}
   */
  getUsersCountAtDate(date) {
    const details = _.find(this.details, (detail) => {
      return detail.date === date;
    });

    if (details) {
      return details.subscribers.sum;
    }

    return 0;
  }
}
