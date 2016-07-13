import React, {Component, PropTypes} from 'react';

const {Checkbox, Input, Select} = LunchBadgerCore.components;

export default class ModelPropertyDetails extends Component {
  static propTypes = {
    property: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  onRemove(property) {
    this.props.onRemove(property);
  }

  render() {
    const {property, index} = this.props;

    return (
      <tr>
        <td>
          <Input value={property.id}
                 type="hidden"
                 name={`properties[${index}][id]`}/>

          <Input className="details-panel__input"
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
          />
        </td>
        <td><i className="fa fa-remove" onClick={() => this.onRemove(property)}></i></td>
      </tr>
    );
  }
}
