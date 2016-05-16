const BaseModel = LunchBadgerCore.models.BaseModel;

export default class Gateway extends BaseModel {
  static type = 'Gateway';
  rootPath = 'https://gateway.root';

  /**
   * @type {Pipeline[]}
   * @private
   */
  _pipelines = [];

  constructor(id, name) {
    super(id);

    this.name = name;
    this.ready = false;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      rootPath: this.rootPath,
      pipelines: this.pipelines.map(pipeline => pipeline.toJSON())
    }
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
