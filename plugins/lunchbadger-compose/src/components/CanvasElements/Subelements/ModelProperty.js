import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
// const {Input, Select, Textarea} = LunchBadgerCore.components;
const {propertyTypes} = LunchBadgerCore.utils;
import {
  Input,
  Select,
  Checkbox,
  IconSVG,
  blockedEscapingKeys,
} from '../../../../../lunchbadger-ui/src';
import {iconDelete, iconPlus} from '../../../../../../src/icons';
import './ModelProperty.scss';

class ModelPropertyDetails extends Component {
  onRemove = () => {
    const {property, onRemove} = this.props;
    onRemove(property);
  }

  checkTabButton = (event) => {
    if ((event.which === 9 || event.keyCode === 9) && !event.shiftKey && this.props.propertiesCount === this.props.idx + 1) {
      if (blockedEscapingKeys[0]) return;
      const {parentId, addAction} = this.props;
      addAction(parentId)();
    }
  }

  onPropertyTypeChange = (type) => {
    const {property, onPropertyTypeChange, nested, index, parentId} = this.props;
    onPropertyTypeChange(property.id, type);
    setTimeout(() => {
      const idx = `${parentId}${this.props.idx}`;
      const prefix = nested ? `models${index}` : '';
      const input = document.querySelector(`.Entity.highlighted .select__${prefix}properties${idx}type button`);
      input && input.focus();
    }, 500);
  }

  render() {
    const {property, parentId, addAction, nested, index} = this.props;
    const idx = `${parentId}/${this.props.idx}`;
    const type = property.type || 'string';
    const isNested = ['array', 'object'].includes(property.type);
    const nameId = nested ? `models[${index}][properties][${idx}][id]` : `properties[${idx}][id]`;
    const nameRequired = nested ? `models[${index}][properties][${idx}][required]` : `properties[${idx}][required]`;
    const nameIndex = nested ? `models[${index}][properties][${idx}][index]` : `properties[${idx}][index]`;
    const nameDescription = nested ? `models[${index}][properties][${idx}][description]` : `properties[${idx}][description]`;
    const nameDefault = nested ? `models[${index}][properties][${idx}][default_]` : `properties[${idx}][default_]`;
    const nameName = nested ? `models[${index}][properties][${idx}][name]` : `properties[${idx}][name]`;
    const nameType = nested ? `models[${index}][properties][${idx}][type]` : `properties[${idx}][type]`;
    const nameItemOrder = nested ? `models[${index}][properties][${idx}][itemOrder]` : `properties[${idx}][itemOrder]`;
    return (
      <div className="ModelProperty">
        <Input
          value={property.id}
          type="hidden"
          name={nameId}
        />
        <Checkbox
          value={property.required}
          hidden
          name={nameRequired}
        />
        <Checkbox
          value={property.index}
          hidden
          name={nameIndex}
        />
        <Input
          type="hidden"
          value={property.description}
          name={nameDescription}
        />
        <Input
          type="hidden"
          value={property.itemOrder}
          name={nameItemOrder}
        />
        {!isNested && (
          <Input
            type="hidden"
            value={property.default_}
            name={nameDefault}
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
              name={nameName}
              fullWidth
              className="EntityProperty__field--input"
            />
          </div>
        </div>
        <div className={cs('ModelProperty__col', 'type')}>
          <div className="EntityProperty__field">
            <div className="EntityProperty__field--text">
              <span className="EntityProperty__field--textValue">
                {propertyTypes.find(item => item.value === (type || 'string')).label}
              </span>
            </div>
            <Select
              value={type || 'string'}
              handleChange={this.onPropertyTypeChange}
              handleKeyDown={this.checkTabButton}
              name={nameType}
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
  idx: PropTypes.number.isRequired,
  parentId: PropTypes.string.isRequired,
};

export default ModelPropertyDetails;
