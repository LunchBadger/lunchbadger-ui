import Pipeline from './Pipeline';

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

    const pipeline = Pipeline.create({
      name: 'Pipeline 1'
    });

    this.addPipeline(pipeline);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      rootPath: this.rootPath
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
