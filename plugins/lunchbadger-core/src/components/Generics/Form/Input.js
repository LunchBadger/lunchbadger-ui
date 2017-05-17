import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import HOC from '../../../../../lunchbadger-ui/src/utils/Formsy/HOC';

class Input extends Component {
  static propTypes = {
    getValue: PropTypes.func,
    setValue: PropTypes.func,
    handleBlur: PropTypes.func,
    handleKeyPress: PropTypes.func,
    handleKeyUp: PropTypes.func,
    handleKeyDown: PropTypes.func,
    handleChange: PropTypes.func,
    className: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string
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

  _handleBlur = (event) => {
    if (typeof this.props.handleBlur === 'function') {
      this.props.handleBlur(event);
    }
  }

  _handleChange = (event) => {
    this.props.setValue(event.target.value);
    if (typeof this.props.handleChange === 'function') {
      this.props.handleChange(event);
    }
  }

  render() {
    const {
      className,
      getValue,
      type,
      name,
      placeholder,
      underlineStyle,
      underlineFocusStyle,
    } = this.props;
    const rootStyle = {
      height: 'inherit',
      fontSize: 'inherit',
      fontWeight: 400,
      color: 'inherit',
    }
    const inputStyle = {
      fontSize: 'inherit',
      fontWeight: 400,
      color: 'inherit',
    };
    const underlineStyles = {
      ...underlineStyle,
      borderColor: '#999',
      bottom: 1,
    };
    const underlineFocusStyles = {
      ...underlineFocusStyle,
      bottom: 1,
      borderWidth: 2,
    };
    return (
      <span className={className || ''} style={{display: type === 'hidden' ? 'none' : 'inline-block'}}>
        <TextField
          value={getValue()}
          type={type || 'text'}
          onBlur={this._handleBlur}
          onKeyPress={this._handleKeyPress}
          onKeyUp={this._handleKeyUp}
          onKeyDown={this._handleKeyDown}
          onChange={this._handleChange}
          id={name}
          placeholder={placeholder}
          fullWidth
          style={rootStyle}
          inputStyle={inputStyle}
          underlineStyle={underlineStyles}
          underlineFocusStyle={underlineFocusStyles}
        />
      </span>
    );
    return (
      <input className={this.props.className || ''}
             value={this.props.getValue()}
             type={this.props.type || 'text'}
             onBlur={this._handleBlur}
             onKeyPress={this._handleKeyPress}
             onKeyUp={this._handleKeyUp}
             onKeyDown={this._handleKeyDown}
             onChange={this._handleChange}
             id={this.props.name}
             placeholder={this.props.placeholder}
      />
    );
  }
}

export default HOC(Input);
