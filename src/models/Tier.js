import TierDetails from './TierDetails';

const BaseModel = LunchBadgerCore.models.BaseModel;

export default class Tier extends BaseModel {
  static type = 'Tier';

	/**
   * @type {TierDetails[]}
   * @private
   */
  _details = [];

  constructor(id) {
    super(id);
  }

  toJSON() {
    return {
      id: this.id,
      details: this.details.map((detail) => {
        return detail.toJSON()
      })
    }
  }

	/**
   * @returns {TierDetails[]}
   */
  get details() {
    return this._details;
  }

	/**
   * @param details {TierDetails[]}
   */
  set details(details) {
    this._details = details.map((detail) => {
      if (detail.constructor.type === TierDetails.type) {
        return detail;
      }

      return TierDetails.create(detail);
    });
  }
}
