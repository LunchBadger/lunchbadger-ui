const BaseModel = LunchBadgerCore.models.BaseModel;

export default class TierDetails extends BaseModel {
  static type = 'TierDetails';
  
  _date = null;
  _conditionFrom = null;
  _conditionTo = null;
  _type = null;
  _value = null;

  constructor(id, date, conditionFrom, conditionTo, type, value) {
    super(id);

    this.date = date;
    this.conditionFrom = conditionFrom;
    this.conditionTo = conditionTo;
    this.type = type;
    this.value = value;
  }

  toJSON() {
    return {
      id: this.id,
      date: this.date,
      conditionFrom: this.conditionFrom,
      conditionTo: this.conditionTo,
      type: this.type,
      value: this.value
    }
  }

  get date() {
    return this._date;
  }

  set date(date) {
    this._date = date;
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
