import React, {Component} from 'react';
import Input from '../../Generics/Form/Input';

class InputField extends Component {
  render() {
    const inputProps = Object.assign({}, this.props, {
      value: this.props.entity[this.props.propertyName],
      name: this.props.propertyName
    });
    return (
      <div className="details-panel__fieldset">
        <label className="details-panel__label"
               htmlFor={this.props.propertyName}>{this.props.label}</label>
        <Input className="details-panel__input" {...inputProps} />
      </div>
    );
  }
}

export default InputField;
