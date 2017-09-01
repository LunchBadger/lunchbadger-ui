import {update, remove} from '../reduxActions/gateways';
import Pipeline from './Pipeline';
import Policy from './Policy';

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
  }

  static create(data) {
    return super.create({
      ...data,
      pipelines: (data.pipelines || []).map(pipeline => Pipeline.create({
        ...pipeline,
        policies: pipeline.policies.map(policy => Policy.create(policy)),
      })),
    });
  }

  recreate() {
    return Gateway.create(this);
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

  /**
   * @param pipeline {Pipeline}
   */
  removePipeline(pipeline) {
    _.remove(this._pipelines, function (_pipeline) {
      return _pipeline.id === pipeline.id
    });
  }

  validate(model) {
    return (_, getState) => {
      const validations = {data: {}};
      const entities = getState().entities.gateways;
      const {messages, checkFields} = LunchBadgerCore.utils;
      if (model.name !== '') {
        const isDuplicateName = Object.keys(entities)
          .filter(id => id !== this.id)
          .filter(id => entities[id].name.toLowerCase() === model.name.toLowerCase())
          .length > 0;
        if (isDuplicateName) {
          validations.data.name = messages.duplicatedEntityName('Gateway');
        }
      }
      const fields = ['name', 'dnsPrefix'];
      checkFields(fields, model, validations.data);
      validations.isValid = Object.keys(validations.data).length === 0;
      return validations;
    }
  }

  update(model) {
    return async dispatch => await dispatch(update(this, model));
  }

  remove() {
    return async dispatch => await dispatch(remove(this));
  }

}
