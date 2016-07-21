import React, {Component} from 'react';
import Checkbox from '../../Generics/Form/Checkbox';

class CheckboxField extends Component {
  render() {
    const inputProps = Object.assign({}, this.props, {
      value: this.props.entity[this.props.propertyName],
      name: this.props.propertyName
    });
    return (
      <div className="details-panel__fieldset">
        <Checkbox {...inputProps} />
        <label className="details-panel__checkbox-label"
               htmlFor={this.props.propertyName}>{this.props.label}</label>
      </div>
    );
  }
}

export default CheckboxField;
