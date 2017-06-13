import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MaterialUICheckbox from 'material-ui/Checkbox';
import HOC from '../../../../../lunchbadger-ui/src/utils/Formsy/HOC';

class Checkbox extends Component {
  static propTypes = {
    getValue: PropTypes.func,
    setValue: PropTypes.func,
    handleChange: PropTypes.func,
    className: PropTypes.string,
    type: PropTypes.string,
    label: PropTypes.string,
  };

  _handleChange = (event) => {
    this.props.setValue(event.currentTarget.checked);

    if (typeof this.props.handleChange === 'function') {
      this.props.handleChange(event);
    }
  }

  render() {
    const {className, getValue, name, label} = this.props;
    return (
      <MaterialUICheckbox
        className={className || ''}
        type="checkbox"
        checked={getValue()}
        id={name}
        onCheck={this._handleChange}
        label={label}
      />
    );
  }
}

export default HOC(Checkbox);
