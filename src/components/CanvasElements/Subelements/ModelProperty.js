import React, {Component, PropTypes} from 'react';
import './ModelProperty.scss';

const Input = LBCore.components.Input;

export default class ModelProperty extends Component {
  static propTypes = {
    property: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {property, index} = this.props;

    return (
      <div className="model-property">
        <div className="model-property__key-cell">
          <span className="model-property__value key hide-while-edit">
            {property.propertyKey}
          </span>
          <Input className="model-property__input editable-only"
                 value={property.propertyKey}
                 name={`properties[${index}][propertyKey]`}/>
        </div>
        <div className="model-property__value-cell">
          <span className="model-property__value value hide-while-edit">
            {property.propertyValue}
          </span>
          <Input className="model-property__input editable-only"
                 value={property.propertyValue}
                 name={`properties[${index}][propertyValue]`}/>
        </div>

        <Input value={property.propertyIsIndex}
               type="hidden"
               name={`properties[${index}][propertyIsIndex]`}/>
        <Input value={property.propertyIsRequired}
               type="hidden"
               name={`properties[${index}][propertyIsRequired]`}/>
        <Input value={property.propertyNotes}
               type="hidden"
               name={`properties[${index}][propertyNotes]`}/>
        <Input value={property.propertyType}
               type="hidden"
               name={`properties[${index}][propertyType]`}/>
        <Input value={property.id}
               type="hidden"
               name={`properties[${index}][id]`}/>
      </div>
    );
  }
}
