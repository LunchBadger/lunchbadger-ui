import React, {Component} from 'react';
import PropTypes from 'prop-types';
const {Input, Select, Textarea} = LunchBadgerCore.components;
const {propertyTypes} = LunchBadgerCore.utils;
import {Checkbox} from '../../../../../lunchbadger-ui/src';

class ModelPropertyDetails extends Component {
  onRemove = () => {
    const {property, onRemove} = this.props;
    onRemove(property);
  }

  // FIXME - restore this functionality after discussion, how it should works with nested properties
  // _checkTabButton = (event) => {
  //   if ((event.which === 9 || event.keyCode === 9) && !event.shiftKey && this.props.propertiesCount === this.props.index + 1) {
  //     this.props.addAction();
  //   }
  // }

  onPropertyTypeChange = (type) => {
    const {property, onPropertyTypeChange} = this.props;
    onPropertyTypeChange(property.id, type);
  }

  render() {
    const {property, parentId} = this.props;
    const index = `${parentId}/${this.props.index}`;
    const type = property.type || 'string';
    return (
      <tr>
        <td>
          <Input
            value={property.id}
            type="hidden"
            name={`properties[${index}][id]`}
          />
          <Input
            className="details-panel__input details-key"
            value={property.name}
            name={`properties[${index}][name]`}
          />
        </td>
        <td>
          <Select
            className="details-panel__input details-panel__select"
            value={type || 'string'}
            handleChange={this.onPropertyTypeChange}
            name={`properties[${index}][type]`}
            options={propertyTypes}
          />
        </td>
        <td>
          {!['array', 'object'].includes(property.type) && (
            <Input
              className="details-panel__input"
              value={property.default_}
              name={`properties[${index}][default_]`}
            />
          )}
        </td>
        <td>
          <Checkbox
            value={property.required}
            name={`properties[${index}][required]`}
          />
        </td>
        <td>
          <Checkbox
            value={property.index}
            name={`properties[${index}][index]`}
          />
        </td>
        <td>
          <Input
            className="details-panel__input"
            value={property.description}
            name={`properties[${index}][description]`}
            type="text"
                 // handleKeyDown={this._checkTabButton} // FIXME
          />
        </td>
        <td className="details-panel__table__cell details-panel__table__cell--empty">
          <i className="fa fa-remove details-panel__table__action" onClick={this.onRemove}/>
        </td>
      </tr>
    );
  }
}

ModelPropertyDetails.propTypes = {
  property: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
  addAction: PropTypes.func.isRequired,
  onPropertyTypeChange: PropTypes.func.isRequired,
  propertiesCount: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  parentId: PropTypes.string.isRequired,
};

export default ModelPropertyDetails;
