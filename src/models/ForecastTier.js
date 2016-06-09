const Tier = LunchBadgerMonetize.models.Tier;

export default class ForecastTier extends Tier {
  static type = 'ForecastTier';

  constructor(id) {
    super(id);
  }

  /**
   * @param details {TierDetails}
   */
  addTierDetails(details) {
    this.details.push(details);
  }
}
