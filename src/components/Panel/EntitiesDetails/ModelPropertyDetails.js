import React, {Component, PropTypes} from 'react';

const Input = LunchBadgerCore.components.Input;
const Checkbox = LunchBadgerCore.components.Checkbox;

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
          <Input className="details-panel__input"
                 value={property.propertyType}
                 name={`properties[${index}][propertyType]`}
          />
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
