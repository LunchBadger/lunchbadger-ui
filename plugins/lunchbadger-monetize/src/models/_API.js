import uuid from 'uuid';
import _ from 'lodash';
import APIPlan from './_APIPlan';

const {PublicEndpoint} = LunchBadgerManage.models;

const initialModel = {
  name: 'API',
  itemOrder: 0,
  plans: [
    {
      name: 'Free',
      icon: 'fa-paper-plane',
    },
    {
      name: 'Developer',
      icon: 'fa-plane',
    },
    {
      name: 'Professional',
      icon: 'fa-fighter-jet',
    },
  ],
  publicEndpoints: [],
  metadata: {
    type: 'API',
    loaded: true,
    processing: false,
    top: 0,
    left: 0,
  },
}

export default {
  create: (model, metadata) => {
    const id = model.id || uuid.v4();
    const publicEndpoints = model.publicEndpoints || initialModel.publicEndpoints;
    const plans = model.plans || initialModel.plans;
    return {
      ...initialModel,
      ...model,
      plans: plans.map(item => APIPlan.create(item)),
      publicEndpoints: publicEndpoints.map(item => PublicEndpoint.create(item)),
      id,
      metadata: {
        ...initialModel.metadata,
        ...metadata,
        id,
      },
    };
  },
  toJSON: entity => {
    const json = _.merge({}, entity);
    delete json.metadata;
    json.plans.forEach(plan => {
      delete plan.metadata;
    });
    return json;
  },
  validate: (entity, model, state) => {
    const invalid = {};
    const {messages, checkFields} = LunchBadgerCore.utils;
    if (model.name !== '') {
      const isDuplicateName = Object.keys(state.entities.apis)
        .filter(id => id !== entity.metadata.id)
        .filter(id => state.entities.apis[id].name.toLowerCase() === model.name.toLowerCase())
        .length > 0;
      if (isDuplicateName) {
        invalid.name = messages.duplicatedEntityName('API');
      }
    }
    const fields = ['name'];
    checkFields(fields, model, invalid);
    return invalid;
  },
};
