import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {HOC} from 'formsy-react';

class Checkbox extends Component {
  static propTypes = {
    getValue: PropTypes.func,
    setValue: PropTypes.func,
    handleChange: PropTypes.func,
    className: PropTypes.string,
    type: PropTypes.string
  };

  shouldComponentUpdate(nextProps, nextState) {
    const shallow = shallowCompare(this, nextProps, nextState);
    return shallow || this.props.getValue() !== nextProps.value;
  }

  _handleChange(event) {
    this.props.setValue(event.currentTarget.checked);

    if (typeof this.props.handleChange === 'function') {
      this.props.handleChange(event);
    }
  }

  render() {
    return (
      <input className={this.props.className || ''}
             value={this.props.getValue()}
             type="checkbox"
             checked={this.props.getValue() ? 'checked' : null}
             id={this.props.name}
             onChange={this._handleChange.bind(this)}/>
    );
  }
}

export default HOC(Checkbox);
