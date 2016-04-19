import BaseModel from './BaseModel';
import Pipeline from './Pipeline';

const pipeline = Pipeline.create({
  name: 'Pipeline 1'
});

export default class Gateway extends BaseModel {
  static type = 'Gateway';

  /**
   * @type {Pipeline[]}
   * @private
   */
  _pipelines = [];

  constructor(id, name) {
    super(id);

    this.name = name;
    this.ready = false;
    this.addPipeline(pipeline);
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
