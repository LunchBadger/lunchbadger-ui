export default class Strategy {
  _fulfilledAction = null;
  _checkAction = null;

  constructor(checkAction, fulfilledAction) {
    this.checkAction = checkAction;
    this.fulfilledAction = fulfilledAction;
  }

  get fulfilledAction() {
    return this._fulfilledAction;
  }

  set fulfilledAction(action) {
    this._fulfilledAction = action;
  }

  get checkAction() {
    return this._checkAction;
  }

  set checkAction(action) {
    this._checkAction = action;
  }

  checkAndFulfill(...params) {
    if (this.checkAction(...params)) {
      this.fulfilledAction(...params);

      return true;
    }

    return false;
  }
}
