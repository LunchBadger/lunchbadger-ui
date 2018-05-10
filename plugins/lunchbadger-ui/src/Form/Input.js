import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import PropTypes from 'prop-types';
import slug from 'slug';
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
    slugify: PropTypes.bool,
  };

  static defaultProps = {
    textarea: false,
    alignRight: false,
    invalidUnderlineColor: '#f44336',
    slugify: false,
  }

  componentDidMount() {
    window.addEventListener('changeInputText', this.changeInputText);
  }

  componentWillUnmount() {
    window.removeEventListener('changeInputText', this.changeInputText);
  }

  changeInputText = ({detail: {selector, value, callback}}) => {
    const expectedInput = document.querySelector(selector);
    const thisInput = findDOMNode(this.wrapperRef);
    if (expectedInput === thisInput) {
      this._handleChange({target: {value}});
      setTimeout(callback);
    }
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
    const {setValue, handleChange, type, slugify} = this.props;
    let {value} = event.target;
    if (type === 'number') {
      value = +value || 0;
    }
    if (slugify) {
      value = slug(value, {lower: true});
    }
    setValue(value);
    if (typeof handleChange === 'function') {
      handleChange(event);
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
      <div
        className={cs(className, getPlainText(`input__${name}`))}
        style={{display: type === 'hidden' ? 'none' : undefined}}
        ref={r => this.wrapperRef = r}
      >
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
          autoComplete={type === 'password' ? 'off' : undefined}
        />
      </div>
    );
  }
}

export default HOC(Input);
