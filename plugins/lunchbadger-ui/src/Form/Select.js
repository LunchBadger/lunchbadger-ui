import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
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
    secondaryOptions: PropTypes.array,
    hideUnderline: PropTypes.bool,
    autocomplete: PropTypes.bool,
  };

  static defaultProps = {
    autocomplete: false,
    secondaryOptions: [],
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

  _handleAutoCompleteChange = (value) => {
    let val = value;
    if (typeof value === 'object') {
      val = value.text;
    }
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

  getDataSource = () => {
    const {options, secondaryOptions} = this.props;
    return options.map(({value: text, icon}) => ({text, value: <MenuItem primaryText={text} rightIcon={icon} />}))
      .concat(secondaryOptions.map(({value}) => ({text: value, value})));
  };

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
    let icon = null;
    if (!focused) {
      const selectedOption = options.find(({value}) => value === getValue());
      if (selectedOption && selectedOption.icon) {
        icon = selectedOption.icon;
      }
    }
    const style = {
      fontWeight: 'inherit',
      fontSize: 'inherit',
      color: 'inherit',
    };
    const labelStyle = {
      ...style,
      padding: '0 8px',
    }
    if (icon) {
      Object.assign(labelStyle, {
        textIndent: 25,
        color: '#4190CE',
        fontWeight: 600,
        fontSize: 14,
      });
    }
    const underlineStyle = {};
    if (hideUnderline) {
      underlineStyle.display = 'none';
    }
    let searchText = focused ? val : getValue();
    if (icon) {
      searchText = _.upperCase(searchText);
    }
    if (autocomplete) return (
      <span className="Select__autocomplete">
        <AutoComplete
          ref={r => this.autocompleteRef = r}
          name={name}
          searchText={searchText}
          filter={AutoComplete.fuzzyFilter}
          openOnFocus
          dataSource={this.getDataSource()}
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
        {icon}
      </span>
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
