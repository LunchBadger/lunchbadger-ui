import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import AutoComplete from 'material-ui/AutoComplete';
import HOC from '../utils/Formsy/HOC';
import getPlainText from '../utils/getPlainText';
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
    autocomplete: PropTypes.bool,
  };

  static defaultProps = {
    autocomplete: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      val: props.getValue(),
    };
  }

  _handleBlur = (event) => {
    if (this.state.focused) return;
    if (typeof this.props.handleBlur === 'function') {
      this.props.handleBlur(event);
    }
  };

  _handleKeyDown = (event) => {
    if (typeof this.props.handleKeyDown === 'function') {
      this.props.handleKeyDown(event);
    }
  };

  _handleChange = (event, index, value) => {
    this.props.setValue(value);
    if (typeof this.props.handleChange === 'function') {
      this.props.handleChange(value);
    }
  };

  _handleAutoCompleteChange = (val) => {
    this.props.setValue(val);
    this.setState({focused: false, val});
    if (typeof this.props.handleBlur === 'function') {
      this.props.handleBlur({target: {value: val}});
    }
    if (this.autocompleteRef) {
      this.autocompleteRef.refs.searchTextField.input.blur();
    }
  };

  handleAutoCompleteFocus = () => this.setState({focused: true, val: ''}); //this.autocompleteRef.refs.searchTextField.input.select();

  handleAutoCompleteMenuClose = () => this.setState({focused: false});

  renderField = () => {
    const {
      getValue,
      multiple,
      options,
      hideUnderline,
      name,
      autocomplete,
    } = this.props;
    const {focused, val} = this.state;
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
    if (autocomplete) return (
      <AutoComplete
        ref={r => this.autocompleteRef = r}
        name={name}
        searchText={focused ? val : getValue()}
        filter={AutoComplete.fuzzyFilter}
        openOnFocus
        dataSource={options.map(({value}) => value)}
        onKeyDown={this._handleKeyDown}
        onBlur={this._handleBlur}
        onNewRequest={this._handleAutoCompleteChange}
        onFocus={this.handleAutoCompleteFocus}
        fullWidth
        style={style}
        inputStyle={labelStyle}
        listStyle={{...style, fontWeight: 400}}
        underlineStyle={underlineStyle}
        menuProps={{desktop: true, maxHeight: 250}}
        onClose={this.handleAutoCompleteMenuClose}
      />
    );
    return (
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
        <MenuItem
          key={idx}
          value={value}
          primaryText={<div className={getPlainText(`${name}__${label}`)}>{label}</div>}
        />
      ))}
      </SelectField>
    );
  }

  render() {
    const {className, name} = this.props;
    return (
      <div className={cs('Select', className, getPlainText(`select__${name}`))}>
        {this.renderField()}
      </div>
    );
  }
}

export default HOC(Select);
