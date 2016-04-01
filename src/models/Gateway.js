import BaseModel from './BaseModel';

export default class Gateway extends BaseModel {
  type = 'Gateway';

  /**
   * @type {Pipeline[]}
   * @private
   */
  _pipelines = [];

  constructor(id, name) {
    super(id);

    this.name = name;
  }

  /**
   * @param pipelines {Pipeline[]}
   */
  set pipelines(pipelines) {
    this._pipelines = pipelines;
  }

	/**
   * @returns {Pipeline[]}
   */
  get pipelines() {
    return this._pipelines;
  }

  /**
   * @param pipeline {Pipeline}
   */
  addPipeline(pipeline) {
    this._pipelines.push(pipeline);
  }
}
