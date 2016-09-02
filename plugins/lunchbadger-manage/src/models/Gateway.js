import Pipeline from './Pipeline';

const BaseModel = LunchBadgerCore.models.BaseModel;

export default class Gateway extends BaseModel {
  static type = 'Gateway';
  dnsPrefix = 'gateway';

  /**
   * @type {Pipeline[]}
   * @private
   */
  _pipelines = [
    Pipeline.create({name: 'Pipeline'})
  ];

  constructor(id, name) {
    super(id);

    this.name = name;
    this.ready = false;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      dnsPrefix: this.dnsPrefix,
      pipelines: this.pipelines.map(pipeline => pipeline.toJSON()),
      itemOrder: this.itemOrder
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
