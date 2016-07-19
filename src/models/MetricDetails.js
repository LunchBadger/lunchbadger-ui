const BaseModel = LunchBadgerCore.models.BaseModel;

export const SUM = 'sum';
export const AVG = 'avg';

export default class MetricDetails extends BaseModel {
  static type = 'MetricDetails';

  _title = '';
  _dateFrom = null;
  _dateTo = null;
  _type = null;
  _value = 0;

  constructor(id, title, dateFrom, dateTo, type, value) {
    super(id);

    this.title = title;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.type = type;
    this.value = value;
  }

  set title(title) {
    this._title = title;
  }

  get title() {
    return this._title;
  }

  set dateFrom(dateFrom) {
    this._dateFrom = dateFrom;
  }

  get dateFrom() {
    return this._dateFrom;
  }

  set dateTo(dateTo) {
    this._dateTo = dateTo;
  }

  get dateTo() {
    return this._dateTo;
  }

  set value(value) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  set type(type) {
    this._type = type;
  }

  get type() {
    return this._type;
  }
}
