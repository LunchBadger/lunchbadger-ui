import React, {Component, PropTypes} from 'react';
import './ModelProperty.scss';
import removeProperty from '../../../actions/CanvasElements/Model/removeProperty';

const {Select, Input} = LunchBadgerCore.components;

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

  _checkTabButton(event) {
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
            {property.type}
          </span>
          <Select className="model-property__input model-property__select canvas-element__input editable-only"
                  value={property.type || 'string'}
                  handleKeyDown={this._checkTabButton.bind(this)}
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
