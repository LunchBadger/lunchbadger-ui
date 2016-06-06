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

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      icon: this.icon,
      tiers: this.tiers.map((tier) => {
        return tier.toJSON()
      }),
      details: this.details.map((detail) => {
        return detail.toJSON()
      })
    }
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

  getUsersCountAtDateIncludingUpgrades(date, api) {
    const detail = this.findDetail({date: date});

    if (detail) {
      const existingCount = detail.subscribers.sum;

      return existingCount + this.getPlanUpgradedUsers(date, api) - this.getPlanDowngradedUsers(date, api);
    }

    return 0;
  }

  getPlanDowngradedUsers(date, api, downgrade = null) {
    const detail = this.findDetail({date: date});
    const existingUsersCount = detail.subscribers.sum;
    const params = {fromPlanId: this.id, date: date};

    if (downgrade !== null) {
      params.downgrade = downgrade;
    }

    const downgrades = api.findUpgrades(params);
    let totalDowngradesCount = 0;

    downgrades.forEach((downgrade) => {
      totalDowngradesCount += Math.round(existingUsersCount * (downgrade.value / 100));
    });

    return totalDowngradesCount;
  }

  getPlanUpgradedUsers(date, api, downgrade = null) {
    const params = {toPlanId: this.id, date: date};

    if (downgrade !== null) {
      params.downgrade = downgrade;
    }

    const upgrades = api.findUpgrades(params);
    let totalUpgradesCount = 0;

    upgrades.forEach((upgrade) => {
      const fromPlan = api.findPlan({id: upgrade.fromPlanId});
      const existingUsers = fromPlan.findDetail({date: date}).subscribers.sum;

      totalUpgradesCount += Math.round(existingUsers * (upgrade.value / 100));
    });

    return totalUpgradesCount;
  }
}
