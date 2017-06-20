import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
const {Input, Select, Textarea} = LunchBadgerCore.components;
const {propertyTypes} = LunchBadgerCore.utils;
import {Checkbox, IconSVG} from '../../../../../lunchbadger-ui/src';
import {iconDelete, iconPlus} from '../../../../../../src/icons';
import './ModelProperty.scss';

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
    const {property, parentId, addAction} = this.props;
    const index = `${parentId}/${this.props.index}`;
    const type = property.type || 'string';
    const isNested = ['array', 'object'].includes(property.type);
    return (
      <div className="ModelProperty">
        <Input
          value={property.id}
          type="hidden"
          name={`properties[${index}][id]`}
        />
        <Checkbox
          value={property.required}
          hidden
          name={`properties[${index}][required]`}
        />
        <Checkbox
          value={property.index}
          hidden
          name={`properties[${index}][index]`}
        />
        <Input
          type="hidden"
          value={property.description}
          name={`properties[${index}][description]`}
          // handleKeyDown={this._checkTabButton} // FIXME
        />
        {!isNested && (
          <Input
            type="hidden"
            value={property.default_}
            name={`properties[${index}][default_]`}
          />
        )}
        <div className={cs('ModelProperty__col', 'name')}>
          <div className="EntityProperty__field">
            <div className="EntityProperty__field--text">
              <span className="EntityProperty__field--textValue">
                {property.name}
              </span>
            </div>
            <Input
              value={property.name}
              name={`properties[${index}][name]`}
              fullWidth
              className="EntityProperty__field--input"
            />
          </div>
        </div>
        <div className={cs('ModelProperty__col', 'type')}>
          <div className="EntityProperty__field">
            <div className="EntityProperty__field--text">
              <span className="EntityProperty__field--textValue">
                {type || 'string'}
              </span>
            </div>
            <Select
              value={type || 'string'}
              handleChange={this.onPropertyTypeChange}
              name={`properties[${index}][type]`}
              options={propertyTypes}
              className="EntityProperty__field--input"
            />
          </div>
        </div>
        <div className={cs('ModelProperty__col', 'actions')}>
          <div className="ModelProperty__action" onClick={this.onRemove}>
            <IconSVG svg={iconDelete} />
          </div>
          {isNested && (
            <div className="ModelProperty__action" onClick={addAction(property.id)}>
              <IconSVG svg={iconPlus} />
            </div>
          )}
        </div>
      </div>
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
