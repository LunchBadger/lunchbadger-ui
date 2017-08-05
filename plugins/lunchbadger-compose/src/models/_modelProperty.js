import uuid from 'uuid';
import _ from 'lodash';

const initialModel = {
  name: '',
  default_: '',
  type: 'string',
  required: false,
  index: false,
  description: '',
  facetName: 'server',
}

export default {
  create: (property = {}) => {
    const id = property.lunchbadgerId || uuid.v4();
    const default_ = property.default || initialModel.default_;
    delete property.default;
    return {
      ...initialModel,
      ...property,
      id,
      lunchbadgerId: id,
      default_,
    };
  },
  toJSON: (modelId, item) => {
    const json = _.merge({}, item);
    json.modelId = modelId;
    json.id = `${modelId}.${json.name}`;
    json.default = json.default || json.default_;
    // delete json.parentId;
    delete json.default_;
    return json;
  }
};
