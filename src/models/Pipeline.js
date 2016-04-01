import BaseModel from './BaseModel';

export default class Pipeline extends BaseModel {
  type = 'Pipeline';

  /**
   * @type {Policy[]}
   * @private
   */
  _policies = [];

  constructor(id, name) {
    super(id);

    this.name = name;
  }

	/**
   * @param policies {Policy[]}
   */
  set policies(policies) {
    this._policies = policies;
  }

	/**
   * @returns {Policy[]}
   */
  get policies() {
    return this._policies;
  }
}
