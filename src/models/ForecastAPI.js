import ForecastAPIPlan from './ForecastAPIPlan';
import Upgrade from './Upgrade';

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
    this._upgrades.push(upgrade);
  }

	/**
   * @param plan {ForecastAPIPlan}
   */
  addPlan(plan) {
    this._plans.push(plan);
  }
}
