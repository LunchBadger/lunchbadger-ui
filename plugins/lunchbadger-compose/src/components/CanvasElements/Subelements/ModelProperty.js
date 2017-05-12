import React, {Component, PropTypes} from 'react';
import './ModelProperty.scss';
import removeProperty from '../../../actions/CanvasElements/Model/removeProperty';

const {Select, Input} = LunchBadgerCore.components;
const {propertyTypes} = LunchBadgerCore.utils;

export default class ModelProperty extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    property: PropTypes.object.isRequired,
    addAction: PropTypes.func.isRequired,
    propertiesCount: PropTypes.number.isRequired,
    propertiesForm: PropTypes.func,
    index: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
  }

  onRemove(entity, property) {
    removeProperty(entity, property);
  }

  _checkTabButton = (event) => {
    if ((event.which === 9 || event.keyCode === 9) && !event.shiftKey && this.props.propertiesCount === this.props.index + 1) {
      this.props.addAction();

      setTimeout(() => this._focusLastField());
    }
  }

  _focusLastField() {
    const form = this.props.propertiesForm();

    if (form) {
      form.querySelector('.model-property:last-child .model-property__input').focus();
    }
  }

  render() {
    const {property, index} = this.props;
    let type = property.type || 'string';
    type = typeof type === 'string' ? type : 'object';
    return (
      <div className="model-property">
        <div className="model-property__key-cell">
          <span className="model-property__value key hide-while-edit">
            {property.name}
          </span>
          <Input className="model-property__input canvas-element__input editable-only"
                 ref="keyInput"
                 value={property.name}
                 name={`properties[${index}][name]`}/>
        </div>
        <div className="model-property__value-cell">
          <span className="model-property__value value hide-while-edit">
            {type}
          </span>
          <Select className="model-property__input model-property__select canvas-element__input editable-only"
                  value={type || 'string'}
                  handleKeyDown={this._checkTabButton}
                  name={`properties[${index}][type]`}
                  options={propertyTypes}
          />
        </div>

        <Input value={property.index}
               type="hidden"
               name={`properties[${index}][index]`}/>
        <Input value={property.required}
               type="hidden"
               name={`properties[${index}][required]`}/>
        <Input value={property.description}
               type="hidden"
               name={`properties[${index}][description]`}/>
        <Input value={property.default_}
               type="hidden"
               name={`properties[${index}][default_]`}/>
        <Input value={property.id}
               type="hidden"
               className="property-id"
               name={`properties[${index}][id]`}/>
        <i className="model-property__remove icon-icon-minus"
           onClick={() => this.onRemove(this.props.entity, property)}/>
        <div className="clearfix"></div>
      </div>
    );
  }
}
