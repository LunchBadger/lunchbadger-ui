import {getRandomInt} from './Metric';

const BaseModel = LunchBadgerCore.models.BaseModel;

export const SUM = 'sum';
export const AVG = 'avg';

export const USERS = 'users';
export const REQUESTS = 'requests';
export const APPS = 'apps';
export const PORTALS = 'portals';

export default class MetricDetail extends BaseModel {
  static type = 'MetricDetail';

  _title = '';
  _dateFrom = null;
  _dateTo = null;
  _value = 0;

  simulationInterval = null;

  constructor(id, title, dateFrom, dateTo, value) {
    super(id);
    this.title = title;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.value = value;
    this.simulateWebTraffic();
  }

  recreate() {
    return MetricDetail.create(this);
  }

  simulateWebTraffic() {
    const timeout = getRandomInt(5, 10);
    this.stopSimulation();
    this.simulationInterval = setInterval(() => {
      this.value += getRandomInt(0, 20);
    }, timeout * 1000);
  }

  stopSimulation() {
    clearInterval(this.simulationInterval);
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      value: this.value
    }
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
}
