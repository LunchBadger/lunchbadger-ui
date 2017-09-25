import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import MaterialUICheckbox from 'material-ui/Checkbox';
import uncheckedIcon from './uncheckedIcon';
import HOC from '../utils/Formsy/HOC';
import getPlainText from '../utils/getPlainText';
import './Checkbox.scss';

class Checkbox extends Component {
  static propTypes = {
    getValue: PropTypes.func,
    setValue: PropTypes.func,
    handleBlur: PropTypes.func,
    handleFocus: PropTypes.func,
    handleKeyPress: PropTypes.func,
    handleKeyUp: PropTypes.func,
    handleKeyDown: PropTypes.func,
    handleChange: PropTypes.func,
    className: PropTypes.string,
    label: PropTypes.string,
    hidden: PropTypes.bool,
  };

  static defaultProps = {
    hidden: false,
  };

  _handleKeyPress = (event) => {
    if (typeof this.props.handleKeyPress === 'function') {
      this.props.handleKeyPress(event);
    }
  }

  _handleKeyDown = (event) => {
    if (typeof this.props.handleKeyDown === 'function') {
      this.props.handleKeyDown(event);
    }
  }

  _handleKeyUp = (event) => {
    if (typeof this.props.handleKeyUp === 'function') {
      this.props.handleKeyUp(event);
    }
  }

  _handleFocus = (event) => {
    if (typeof this.props.handleFocus === 'function') {
      this.props.handleFocus(event);
    }
  }

  _handleBlur = (event) => {
    if (typeof this.props.handleBlur === 'function') {
      this.props.handleBlur(event);
    }
  }

  _handleChange = (event) => {
    this.props.setValue(event.currentTarget.checked);
    if (typeof this.props.handleChange === 'function') {
      this.props.handleChange(event);
    }
  }

  renderCheckbox = (style) => {
    const {className, getValue, name, label} = this.props;
    const labelStyle = {
      color: '#999',
    }
    return (
      <MaterialUICheckbox
        className={cs(className, getPlainText(`checkbox__${name}`), getPlainText(`checkbox__${name}__${getValue() ? 'checked' : 'unchecked'}`))}
        type="checkbox"
        checked={getValue()}
        id={name}
        onFocus={this._handleFocus}
        onBlur={this._handleBlur}
        onKeyPress={this._handleKeyPress}
        onKeyUp={this._handleKeyUp}
        onKeyDown={this._handleKeyDown}
        onCheck={this._handleChange}
        style={style}
        label={label}
        labelStyle={labelStyle}
        uncheckedIcon={uncheckedIcon()}
      />
    );
  }

  render() {
    const {label, hidden} = this.props;
    const style = {};
    if (hidden) {
      style.display = 'none';
    }
    if (!label) return (
      <div className="Checkbox noLabel" style={style}>
        {this.renderCheckbox(style)}
      </div>
    );
    return this.renderCheckbox(style);
  }
}

export default HOC(Checkbox);
