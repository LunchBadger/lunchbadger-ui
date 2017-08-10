import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

const {Input, Select} = LunchBadgerCore.components;

const relationTypeOptions = [
  {label: 'hasMany', value: 'hasMany'},
  {label: 'belongsTo', value: 'belongsTo'},
  {label: 'hasAndBelongsToMany', value: 'hasAndBelongsToMany'},
];

class ModelRelationDetails extends Component {
  static propTypes = {
    relation: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired
  };

  onRemove(relation) {
    this.props.onRemove(relation);
  }

  render() {
    const {relation, index, modelOptions} = this.props;
    return (
      <tr>
        <td>
          <Input className="details-panel__input"
                 value={relation.name}
                 name={`relations[${index}][name]`}/>
        </td>
        <td>
          <Select className="details-panel__input details-panel__select"
                value={relation.model || modelOptions[0].value}
                name={`relations[${index}][model]`}
                options={modelOptions}
          />
        </td>
        <td>
          <Select className="details-panel__input details-panel__select"
                  value={relation.type || 'hasMany'}
                  name={`relations[${index}][type]`}
                  options={relationTypeOptions}
          />
        </td>
        <td>
          <Input className="details-panel__input"
                 value={relation.foreignKey}
                 name={`relations[${index}][foreignKey]`}/>
        </td>
        <td className="details-panel__table__cell details-panel__table__cell--empty">
          <i className="fa fa-remove details-panel__table__action" onClick={() => this.onRemove(relation)}/>
        </td>
      </tr>
    );
  }
}

const selector = createSelector(
  state => state.entities.models,
  state => state.entities.modelsBundled,
  (models, modelsBundled) => ({
    modelOptions: Object.keys(models).map(key => models[key].name)
      .concat(Object.keys(modelsBundled).map(key => modelsBundled[key].name))
      .map(label => ({label, value: label})),
  }),
);

export default connect(selector)(ModelRelationDetails);
