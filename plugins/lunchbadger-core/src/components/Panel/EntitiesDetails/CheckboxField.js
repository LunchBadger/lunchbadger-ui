import React, {Component} from 'react';
import {Checkbox} from '../../../../../lunchbadger-ui/src';

class CheckboxField extends Component {
  render() {
    const inputProps = Object.assign({}, this.props, {
      value: this.props.entity[this.props.propertyName],
      name: this.props.propertyName
    });
    return (
      <div className="details-panel__fieldset">
        <Checkbox {...inputProps} label={this.props.label} />
      </div>
    );
  }
}

export default CheckboxField;
