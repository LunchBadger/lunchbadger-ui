import React, {Component, PropTypes} from 'react';
import {HOC} from 'formsy-react';

class Input extends Component {
  static propTypes = {
    getValue: PropTypes.func,
    setValue: PropTypes.func,
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
             onKeyPress={this._handleKeyPress.bind(this)}
             onChange={this._handleChange.bind(this)}
             id={this.props.name}/>
    );
  }
}

export default HOC(Input);
