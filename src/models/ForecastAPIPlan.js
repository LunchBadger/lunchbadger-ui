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

  constructor(id, name, icon) {
    super(id);

    this.name = name;
    this.icon = icon;
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
