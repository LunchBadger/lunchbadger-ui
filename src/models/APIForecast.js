import APIPlan from 'models/APIPlan';

const BaseModel = LunchBadgerCore.models.BaseModel;

const defaultPlans = [
  APIPlan.create({
    name: 'User Pool',
    icon: 'fa-user'
  }),
  APIPlan.create({
    name: 'Minnow',
    icon: 'fa-paper-plane'
  }),
  APIPlan.create({
    name: 'Dolhpin',
    icon: 'fa-plane'
  }),
  APIPlan.create({
    name: 'Whale',
    icon: 'fa-fighter-jet'
  })
];

export default class APIForecast extends BaseModel {
  static type = 'APIForecast';

  /**
   * @type {APIForecast[]}
   * @private
   */
  _plans = [];
  _upgrades = [];

  constructor(id, name, apiId, left, top) {
    super(id);

    this.name = name;
    this.apiId = apiId;
    this.left = left;
    this.top = top;

    this.plans = defaultPlans;
    this.upgrades = [];
  }

  /**
   * @param plans {Plans[]}
   */
  set plans(plans) {
    this._plans = plans;
  }

  /**
   * @returns {Plans[]}
   */
  get plans() {
    return this._plans;
  }

  /**
   * @param plan {Plan}
   */
  addPlan(plan) {
    this._plans.push(plan);
  }

  /**
   * @param upgrades {Upgrades[]}
   */
  set upgrades(upgrades) {
    this._upgrades = upgrades;
  }

  /**
   * @returns {Upgrades[]}
   */
  get upgrades() {
    return this._upgrades;
  }

  /**
   * @param Upgrade {Upgrade}
   */
  addUpgrade(upgrade) {
    this._upgrades.push(upgrade);
  }
}
