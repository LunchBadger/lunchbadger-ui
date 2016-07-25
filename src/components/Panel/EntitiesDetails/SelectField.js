import React, {Component} from 'react';
import Select from '../../Generics/Form/Select';

class SelectField extends Component {
  render() {
    const inputProps = Object.assign({}, this.props, {
      value: this.props.entity[this.props.propertyName],
      name: this.props.propertyName
    });
    return (
      <div className="details-panel__fieldset">
        <label className="details-panel__label"
               htmlFor={this.props.propertyName}>{this.props.label}</label>
        <Select className="details-panel__input" {...inputProps} />
      </div>
    );
  }
}

export default SelectField;
