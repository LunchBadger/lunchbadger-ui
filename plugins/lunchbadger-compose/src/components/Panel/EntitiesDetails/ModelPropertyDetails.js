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
                 value={property.name}
                 name={`properties[${index}][name]`}
          />
        </td>
        <td>
          <Select className="details-panel__input details-panel__select"
                  value={property.type || 'string'}
                  name={`properties[${index}][type]`}>
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
            <option value="boolean">Boolean</option>
            <option value="geopoint">GeoPoint</option>
            <option value="array">Array</option>
            <option value="object">Object</option>
            <option value="buffer">Buffer</option>
          </Select>
        </td>
        <td>
          <Input className="details-panel__input"
                 value={property.default_}
                 name={`properties[${index}][default_]`}
          />
        </td>
        <td>
          <Checkbox className="model-property__input"
                 value={property.required}
                 name={`properties[${index}][required]`}
          />
        </td>
        <td>
          <Checkbox className="model-property__input"
                 value={property.index}
                 name={`properties[${index}][index]`}
          />
        </td>
        <td>
          <Input className="details-panel__input"
                 value={property.description}
                 name={`properties[${index}][description]`}
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
