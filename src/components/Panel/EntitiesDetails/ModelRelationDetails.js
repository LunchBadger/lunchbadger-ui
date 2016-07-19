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
    let modelOptions = Private.getData()
      .filter(entity => entity instanceof Model)
      .map(model => <option value={model.name}>{model.name}</option>);

    return (
      <tr>
        <td>
          <Select className="details-panel__input details-panel__select"
                value={relation.relationModel}
                name={`relations[${index}][relationModel]`}>
            {modelOptions}
          </Select>
        </td>
        <td>
          <Select className="details-panel__input details-panel__select"
                  value={relation.relationType || 'hasMany'}
                  name={`relations[${index}][relationType]`}>
            <option value="hasMany">hasMany</option>
            <option value="belongsTo">belongsTo</option>
            <option value="hasAndBelongsToMany">hasAndBelongsToMany</option>
          </Select>
        </td>
        <td>
          <Input className="details-panel__input"
                 value={relation.relationForeignKey}
                 name={`relations[${index}][relationForeignKey]`}/>
        </td>
        <td><i className="fa fa-remove" onClick={() => this.onRemove(relation)}></i></td>
      </tr>
    );
  }
}
