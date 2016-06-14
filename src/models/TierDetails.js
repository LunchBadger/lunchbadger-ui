const BaseModel = LunchBadgerCore.models.BaseModel;

export default class TierDetails extends BaseModel {
  static type = 'TierDetails';

  _date = null;
  _conditionFrom = null;
  _conditionTo = null;
  _type = null;
  _value = null;

  _conditionFromChanged = false;
  _conditionToChanged = false;
  _typeChanged = false;
  _valueChanged = false;

  constructor(id, date, conditionFrom, conditionTo, type, value, conditionFromChanged, conditionToChanged, typeChanged, valueChanged) {
    super(id);

    this.date = date;
    this.conditionFrom = conditionFrom;
    this.conditionTo = conditionTo;
    this.type = type;
    this.value = value;

    this.conditionFromChanged = conditionFromChanged || false;
    this.conditionToChanged = conditionToChanged || false;
    this.typeChanged = typeChanged || false;
    this.valueChanged = valueChanged || false;
  }

  toJSON() {
    return {
      date: this.date,
      conditionFrom: this.conditionFrom,
      conditionTo: this.conditionTo,
      type: this.type,
      value: this.value,
      conditionFromChanged: this.conditionFromChanged,
      conditionToChanged: this.conditionToChanged,
      typeChanged: this.typeChanged,
      valueChanged: this.valueChanged
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

  get conditionFromChanged() {
    return this._conditionFromChanged;
  }

  set conditionFromChanged(conditionFromChanged) {
    this._conditionFromChanged = conditionFromChanged;
  }

  get conditionToChanged() {
    return this._conditionToChanged;
  }

  set conditionToChanged(conditionToChanged) {
    this._conditionToChanged = conditionToChanged;
  }

  get typeChanged() {
    return this._typeChanged;
  }

  set typeChanged(typeChanged) {
    this._typeChanged = typeChanged;
  }

  get valueChanged() {
    return this._valueChanged;
  }

  set valueChanged(valueChanged) {
    this._valueChanged = valueChanged;
  }
}
