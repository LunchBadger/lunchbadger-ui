import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import HOC from '../utils/Formsy/HOC';
import './Select.scss';

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
    options: PropTypes.array.isRequired,
    hideUnderline: PropTypes.bool,
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
    const {className, getValue, multiple, options, hideUnderline} = this.props;
    const style = {
      fontWeight: 'inherit',
      fontSize: 'inherit',
      color: 'inherit',
    };
    const labelStyle = {
      ...style,
      padding: '0 8px',
    }
    const underlineStyle = {};
    if (hideUnderline) {
      underlineStyle.display = 'none';
    }
    return (
      <div className={cs('Select', className)}>
        <SelectField
          value={getValue()}
          multiple={multiple}
          onKeyDown={this._handleKeyDown}
          onBlur={this._handleBlur}
          onChange={this._handleChange}
          fullWidth
          style={style}
          labelStyle={labelStyle}
          listStyle={{...style, fontWeight: 400}}
          underlineStyle={underlineStyle}
        >
        {options.map(({value, label}, idx) => (
          <MenuItem key={idx} value={value} primaryText={label} />
        ))}
        </SelectField>
      </div>
    );
  }
}

export default HOC(Select);
