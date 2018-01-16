import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import TextField from 'material-ui/TextField';
import HOC from '../utils/Formsy/HOC';
import getPlainText from '../utils/getPlainText';

class Input extends Component {
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
    type: PropTypes.string,
    placeholder: PropTypes.string,
    fullWidth: PropTypes.bool,
    underlineStyle: PropTypes.object,
    underlineFocusStyle: PropTypes.object,
    isInvalid: PropTypes.bool,
    hideUnderline: PropTypes.bool,
    textarea: PropTypes.bool,
    alignRight: PropTypes.bool,
    invalidUnderlineColor: PropTypes.string,
  };

  static defaultProps = {
    textarea: false,
    alignRight: false,
    invalidUnderlineColor: '#f44336',
  }

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
      fullWidth,
      underlineStyle,
      isInvalid,
      hideUnderline,
      textarea,
      alignRight,
      invalidUnderlineColor,
    } = this.props;
    const rootStyle = {
      fontWeight: 'inherit',
      fontSize: 'inherit',
      color: 'inherit',
    }
    const inputStyle = {
      ...rootStyle,
      padding: '0 8px',
    };
    if (alignRight) {
      inputStyle.textAlign = 'right';
    }
    const underlineStyles = {
      ...underlineStyle,
    };
    if (isInvalid) {
      underlineStyles.borderColor = invalidUnderlineColor;
    }
    const underlineFocusStyle = {...underlineStyles};
    if (hideUnderline) {
      underlineStyles.borderColor = 'rgba(0, 0, 0, 0)';
    }
    return (
      <div className={cs(className, getPlainText(`input__${name}`))} style={{display: type === 'hidden' ? 'none' : undefined}}>
        <TextField
          value={getValue()}
          type={type || 'text'}
          onFocus={this._handleFocus}
          onBlur={this._handleBlur}
          onKeyPress={this._handleKeyPress}
          onKeyUp={this._handleKeyUp}
          onKeyDown={this._handleKeyDown}
          onChange={this._handleChange}
          id={name}
          placeholder={placeholder}
          fullWidth={fullWidth}
          style={rootStyle}
          inputStyle={inputStyle}
          underlineStyle={underlineStyles}
          underlineFocusStyle={underlineFocusStyle}
          multiLine={textarea}
          rows={textarea ? 2 : 1}
          rowsMax={textarea ? 4 : 1}
        />
      </div>
    );
  }
}

export default HOC(Input);
