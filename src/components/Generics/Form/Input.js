import React, {Component, PropTypes} from 'react';
import {HOC} from 'formsy-react';

class Input extends Component {
  static propTypes = {
    getValue: PropTypes.func,
    setValue: PropTypes.func,
    handleBlur: PropTypes.func,
    handleKeyPress: PropTypes.func,
    handleChange: PropTypes.func,
    className: PropTypes.string,
    type: PropTypes.string
  };

  _handleKeyPress(event) {
    if (typeof this.props.handleKeyPress === 'function') {
      this.props.handleKeyPress(event);
    }
  }

  _handleBlur(event) {
    if (typeof this.props.handleBlur === 'function') {
      this.props.handleBlur(event);
    }
  }

  _handleChange(event) {
    this.props.setValue(event.target.value);

    if (typeof this.props.handleChange === 'function') {
      this.props.handleChange(event);
    }
  }

  render() {
    return (
      <input className={this.props.className || ''}
             value={this.props.getValue()}
             type={this.props.type || 'text'}
             onBlur={this._handleBlur.bind(this)}
             onKeyPress={this._handleKeyPress.bind(this)}
             onChange={this._handleChange.bind(this)}/>
    );
  }
}

export default HOC(Input);
