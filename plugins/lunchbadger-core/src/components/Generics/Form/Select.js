import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import HOC from '../../../../../lunchbadger-ui/src/utils/Formsy/HOC';

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

  _handleChange = (event, index, value) => {
    this.props.setValue(value);
    if (typeof this.props.handleChange === 'function') {
      this.props.handleChange(value);
    }
  }

  render() {
    const {className, getValue, multiple, options} = this.props;
    const style = {
      fontWeight: 400,
      height: 40,
      // top: 0,
    };
    const labelStyle = {
      ...style,
      lineHeight: '40px',
      top: 0,
    }
    const iconStyle = {
      width: 40,
      height: 40,
      border: 0,
      padding: 0,
    };
    return (
      <span className={className || ''}>
        <SelectField
          value={getValue()}
          multiple={multiple}
          onKeyDown={this._handleKeyDown}
          onBlur={this._handleBlur}
          onChange={this._handleChange}
          fullWidth
          style={style}
          labelStyle={labelStyle}
          listStyle={style}
          iconStyle={iconStyle}
          underlineStyle={{display: 'none'}}
        >
        {options.map(({value, label}, idx) => (
          <MenuItem key={idx} value={value} primaryText={label} />
        ))}
        </SelectField>
      </span>
    )
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
