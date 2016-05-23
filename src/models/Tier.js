import TierDetails from './TierDetails';

const BaseModel = LunchBadgerCore.models.BaseModel;

export default class Tier extends BaseModel {
  static type = 'Tier';

	/**
   * @type {TierDetails[]}
   * @private
   */
  _details = [];

  _conditionFrom = null;
  _conditionTo = null;
  _type = null;
  _value = null;

  constructor(id, conditionFrom, conditionTo, type, value) {
    super(id);

    this.conditionFrom = conditionFrom;
    this.conditionTo = conditionTo;
    this.type = type;
    this.value = value;
  }

  toJSON() {
    return {
      id: this.id,
      details: this.details.map((detail) => {
        return detail.toJSON()
      }),
      conditionFrom: this.conditionFrom,
      conditionTo: this.conditionTo,
      type: this.type,
      value: this.value
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

  get conditionFrom() {
    return this._conditionFrom;
  }

  set conditionFrom(conditionFrom) {
    this._conditionFrom = conditionFrom;
  }

  get conditionTo() {
    return this._conditionTo;
  }

  set conditionTo(conditionTo) {
    this._conditionTo = conditionTo;
  }

  get type() {
    return this._type;
  }

  set type(type) {
    this._type = type;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }
}
