import PlanParameters from './PlanParameters';
import PlanSubscribers from './PlanSubscribers';

const BaseModel = LunchBadgerCore.models.BaseModel;

export default class PlanDetails extends BaseModel {
  _date = null;

  /**
   * @type {PlanSubscribers[]}
   * @private
   */
  _subscribers = [];

  /**
   * @type {PlanParameters[]}
   * @private
   */
  _parameters = [];

  constructor(id, date) {
    super(id);

    this.name = name;
    this.date = date;
  }

	/**
   * @param subscribers {PlanSubscribers[]}
   */
  set subscribers(subscribers) {
    this._subscribers = subscribers.map((subscriber) => {
      if (subscriber.constructor.type === PlanSubscribers.type) {
        return subscriber;
      }

      return PlanSubscribers.create(subscriber);
    });
  }

	/**
   * @returns {PlanSubscribers[]}
   */
  get subscribers() {
    return this._subscribers;
  }

	/**
   * @param parameters {PlanParameters[]}
   */
  set parameters(parameters) {
    this._parameters = parameters.map((parameter) => {
      if (parameter.constructor.type === PlanParameters.type) {
        return subscriber;
      }

      return PlanParameters.create(parameter);
    });
  }

	/**
   * @returns {PlanParameters[]}
   */
  get parameters() {
    return this._parameters;
  }

  set date(date) {
    this._date = date;
  }

  get date() {
    return this._date;
  }
}
