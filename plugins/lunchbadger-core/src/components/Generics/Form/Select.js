import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {HOC} from 'formsy-react';

class Select extends Component {
  static propTypes = {
    getValue: PropTypes.func,
    setValue: PropTypes.func,
    handleBlur: PropTypes.func,
    handleChange: PropTypes.func,
    handleKeyDown: PropTypes.func,
    className: PropTypes.string,
    type: PropTypes.string,
    multiple: PropTypes.bool,
    options: PropTypes.array.isRequired
  };

  shouldComponentUpdate(nextProps, nextState) {
    const shallow = shallowCompare(this, nextProps, nextState);
    return shallow || this.props.getValue() !== nextProps.value;
  }

  _handleBlur = (event) => {
    if (typeof this.props.handleBlur === 'function') {
      this.props.handleBlur(event);
    }
  }

  _handleKeyDown = (event) => {
    if (typeof this.props.handleKeyDown === 'function') {
      this.props.handleKeyDown(event);
    }
  }

  _handleChange = (event) => {
    this.props.setValue(event.target.value);
    if (typeof this.props.handleChange === 'function') {
      this.props.handleChange(event);
    }
  }

  render() {
    return (
      <select className={this.props.className || ''}
              value={this.props.getValue()}
              multiple={this.props.multiple}
              onKeyDown={this._handleKeyDown}
              onBlur={this._handleBlur}
              onChange={this._handleChange}>
        {this.props.options.map(({value, label}, idx) => (
          <option key={idx} value={value}>{label}</option>
        ))}
      </select>
    );
  }
}

export default HOC(Select);
