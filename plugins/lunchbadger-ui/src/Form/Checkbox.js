import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MaterialUICheckbox from 'material-ui/Checkbox';
import uncheckedIcon from './uncheckedIcon';
import HOC from '../utils/Formsy/HOC';

class Checkbox extends Component {
  static propTypes = {
    getValue: PropTypes.func,
    setValue: PropTypes.func,
    handleChange: PropTypes.func,
    className: PropTypes.string,
    label: PropTypes.string,
    hidden: PropTypes.bool,
  };

  static defaultProps = {
    hidden: false,
  };

  _handleChange = (event) => {
    this.props.setValue(event.currentTarget.checked);

    if (typeof this.props.handleChange === 'function') {
      this.props.handleChange(event);
    }
  }

  render() {
    const {className, getValue, name, label, hidden} = this.props;
    const style = {};
    if (hidden) {
      style.display = 'none';
    }
    const labelStyle = {
      color: '#999',
    }
    return (
      <MaterialUICheckbox
        className={className || ''}
        type="checkbox"
        checked={getValue()}
        id={name}
        onCheck={this._handleChange}
        style={style}
        label={label}
        labelStyle={labelStyle}
        uncheckedIcon={uncheckedIcon()}
      />
    );
  }
}

export default HOC(Checkbox);
