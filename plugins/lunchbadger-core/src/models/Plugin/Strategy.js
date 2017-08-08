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

  checkAndFulfill = (...params) => (dispatch) => {
    const checkAction = dispatch(this.checkAction(...params));
    if (checkAction) {
      dispatch(this.fulfilledAction(...params));
      return true;
    } else if (checkAction === false) {
      return false;
    }
    return null;
  }
}
