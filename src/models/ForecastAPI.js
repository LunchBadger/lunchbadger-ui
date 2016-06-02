import ForecastAPIPlan from './ForecastAPIPlan';
import Upgrade from './Upgrade';
import _ from 'lodash';

const BaseModel = LunchBadgerCore.models.BaseModel;

export default class ForecastAPI extends BaseModel {
  static type = 'ForecastAPI';

  /**
   * @type {ForecastAPIPlan[]}
   * @private
   */
  _plans = [];

  /**
   * @type {Upgrade[]}
   * @private
   */
  _upgrades = [];

  constructor(id, name) {
    super(id);

    this.name = name;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      plans: this.plans.map(plan => plan.toJSON()),
      upgrades: this.upgrades.map(upgrade => upgrade.toJSON())
    }
  }

  /**
   * @param plans {ForecastAPIPlan[]}
   */
  set plans(plans) {
    this._plans = plans.map((plan) => {
      if (plan.constructor.type === ForecastAPIPlan.type) {
        return plan;
      }

      return ForecastAPIPlan.create(plan);
    });
  }

  /**
   * @returns {ForecastAPIPlan[]}
   */
  get plans() {
    return this._plans;
  }

  /**
   * @param upgrades {Upgrade[]}
   */
  set upgrades(upgrades) {
    this._upgrades = upgrades.map((upgrade) => {
      if (upgrade.constructor.type === Upgrade.type) {
        return upgrade;
      }

      return Upgrade.create(upgrade);
    });
  }

  /**
   * @returns {Upgrade[]}
   */
  get upgrades() {
    return this._upgrades;
  }

  /**
   * @param upgrade {Upgrade}
   */
  addUpgrade(upgrade) {
    if (!this.findUpgrade({fromPlanId: upgrade.fromPlanId, toPlanId: upgrade.toPlanId, date: upgrade.date})) {
      this._upgrades.push(upgrade);
    }
  }

  /**
   * @param searchParams {Object}
   * @param updateParams {Object}
   */
  updateUpgrade(searchParams, updateParams) {
    const upgrade = this.findUpgrade(searchParams);

    if (upgrade) {
      upgrade.update(updateParams);
    }
  }

  /**
   * @param date {string} - date in format M/YYYY
   */
  getUpgradesForDate(date) {
    return this.findUpgrades({date: date});
  }

  /**
   * @param params {Object} - parameters from Upgrade object
   * @returns {Upgrade|undefined}
   */
  findUpgrade(params) {
    return _.find(this._upgrades, params);
  }

	/**
   * @param searchFunction {Function}
   * @returns {Upgrade|undefined}
   */
  searchForUpgrade(searchFunction) {
    return _.find(this._upgrades, (upgrade) => {
      return searchFunction(upgrade);
    });
  }

  /**
   * @param params {Object} - parameters from Upgrade object
   * @returns {Upgrade[]}
   */
  findUpgrades(params) {
    return _.filter(this._upgrades, params);
  }

  /**
   * @param plan {ForecastAPIPlan}
   */
  addPlan(plan) {
    this._plans.push(plan);
  }

  /**
   * @param params {Object} - parameters from ForecastAPIPlan object
   * @returns {ForecastAPIPlan}
   */
  findPlan(params) {
    return _.find(this._plans, params);
  }

  /**
   * @param params {Object} - parameters from ForecastAPIPlan object
   * @returns {ForecastAPIPlan[]}
   */
  findPlans(params) {
    return _.filter(this._plans, params);
  }
}
