import React, {Component, PropTypes} from 'react';

const {Input, Select} = LunchBadgerCore.components;
const Private = LunchBadgerManage.stores.Private;
const Model = LunchBadgerManage.models.Model;

export default class ModelRelationDetails extends Component {
  static propTypes = {
    relation: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  onRemove(relation) {
    this.props.onRemove(relation);
  }

  render() {
    const {relation, index} = this.props;
    let models = Private.getData()
      .filter(entity => entity instanceof Model)
    let modelOptions = models.map(
      model => <option value={model.name} key={`rel-${model.name}`}>{model.name}</option>);

    return (
      <tr>
        <td>
          <Input className="details-panel__input"
                 value={relation.name}
                 name={`relations[${index}][name]`}/>
        </td>
        <td>
          <Select className="details-panel__input details-panel__select"
                value={relation.model || models[0].name}
                name={`relations[${index}][model]`}>
            {modelOptions}
          </Select>
        </td>
        <td>
          <Select className="details-panel__input details-panel__select"
                  value={relation.type || 'hasMany'}
                  name={`relations[${index}][type]`}>
            <option value="hasMany">hasMany</option>
            <option value="belongsTo">belongsTo</option>
            <option value="hasAndBelongsToMany">hasAndBelongsToMany</option>
          </Select>
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
