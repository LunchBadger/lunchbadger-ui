const Tier = LunchBadgerMonetize.models.Tier;

export default class ForecastTier extends Tier {
  static type = 'ForecastTier';

  constructor(id, name, icon) {
    super(id);

    this.name = name;
    this.icon = icon;
  }

  /**
   * @param details {TierDetails}
   */
  addTierDetails(details) {
    this.details.push(details);
  }
}
