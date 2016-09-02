import React, {Component, PropTypes} from 'react';

const {Checkbox, Input, Select} = LunchBadgerCore.components;

export default class ModelPropertyDetails extends Component {
  static propTypes = {
    property: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired,
    addAction: PropTypes.func.isRequired,
    propertiesCount: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
  }

  onRemove(property) {
    this.props.onRemove(property);
  }

  _checkTabButton(event) {
    if ((event.which === 9 || event.keyCode === 9) && !event.shiftKey && this.props.propertiesCount === this.props.index + 1) {
      this.props.addAction();
    }
  }

  render() {
    const {property, index} = this.props;

    return (
      <tr>
        <td>
          <Input value={property.id}
                 type="hidden"
                 name={`properties[${index}][id]`}/>

          <Input className="details-panel__input details-key"
                 value={property.propertyKey}
                 name={`properties[${index}][propertyKey]`}
          />
        </td>
        <td>
          <Select className="details-panel__input details-panel__select"
                  value={property.propertyType || 'String'}
                  name={`properties[${index}][propertyType]`}>
            <option value="String">String</option>
            <option value="Number">Number</option>
            <option value="Date">Date</option>
            <option value="Boolean">Boolean</option>
            <option value="GeoPoint">GeoPoint</option>
            <option value="Array">Array</option>
            <option value="Object">Object</option>
            <option value="Buffer">Buffer</option>
          </Select>
        </td>
        <td>
          <Input className="details-panel__input"
                 value={property.propertyValue}
                 name={`properties[${index}][propertyValue]`}
          />
        </td>
        <td>
          <Checkbox className="model-property__input"
                 value={property.propertyIsRequired}
                 name={`properties[${index}][propertyIsRequired]`}
          />
        </td>
        <td>
          <Checkbox className="model-property__input"
                 value={property.propertyIsIndex}
                 name={`properties[${index}][propertyIsIndex]`}
          />
        </td>
        <td>
          <Input className="details-panel__input"
                 value={property.propertyNotes}
                 name={`properties[${index}][propertyNotes]`}
                 type="text"
                 handleKeyDown={this._checkTabButton.bind(this)}
          />
        </td>
        <td className="details-panel__table__cell details-panel__table__cell--empty">
          <i className="fa fa-remove details-panel__table__action" onClick={() => this.onRemove(property)}/>
        </td>
      </tr>
    );
  }
}
