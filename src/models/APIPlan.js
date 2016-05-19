import Tier from './Tier';
import PlanDetails from './PlanDetails';

const BaseModel = LunchBadgerCore.models.BaseModel;

const defaultTiers = [
  Tier.create({
    name: 'Tier 1',
    totals: '1 - 5000',
    charge: 0.02
  }),
  Tier.create({
    name: 'Tier 2',
    totals: '1 - 5000',
    charge: 0.02
  }),
  Tier.create({
    name: 'Tier 3',
    totals: '1 - 5000',
    charge: 0.02
  }),
  Tier.create({
    name: 'Tier 4',
    totals: '1 - 5000',
    charge: 0.02
  })
];

export default class APIPlan extends BaseModel {
  static type = 'APIPlan';

	/**
   * @type {Tier[]}
   * @private
   */
  _tiers = [];

	/**
   * @type {PlanDetails[]}
   * @private
   */
  _details = [];

  constructor(id, name, icon) {
    super(id);

    this.name = name;
    this.icon = icon;

    this.tiers = defaultTiers;
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
   * @param tiers {Tier[]}
   */
  set tiers(tiers) {
    this._tiers = tiers;
  }

  /**
   * @returns {Tier[]}
   */
  get tiers() {
    return this._tiers;
  }

  /**
   * @param tier {Tier}
   */
  addTier(tier) {
    this._tiers.push(tier);
  }

	/**
   * @param details {PlanDetails[]}
   */
  set details(details) {
    this._details = details.map((detail) => {
      if (detail.constructor.type === PlanDetails.type) {
        return detail;
      }

      return PlanDetails.create(detail);
    });
  }

	/**
   * @returns {PlanDetails[]}
   */
  get details() {
    return this._details;
  }
}
