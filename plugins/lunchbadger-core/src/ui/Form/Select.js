import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cs from 'classnames';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import AutoComplete from 'material-ui/AutoComplete';
import Multiselect from './Multiselect';
import HOC from '../utils/Formsy/HOC';
import getPlainText from '../utils/getPlainText';
import './Select.scss';

const optionsMapping = ({value: text, icon}) => ({text, value: <MenuItem primaryText={text} rightIcon={icon} />});

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
    restrict: PropTypes.bool,
  };

  static defaultProps = {
    autocomplete: false,
    restrict: false,
    secondaryOptions: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      val: props.getValue(),
    };
  }

  componentDidMount() {
    window.addEventListener('changeInputSelect', this.changeInputSelect);
  }

  componentWillUnmount() {
    window.removeEventListener('changeInputSelect', this.changeInputSelect);
  }

  changeInputSelect = ({detail: {selector, value, callback}}) => {
    const expectedInput = document.querySelector(selector);
    const thisInput = findDOMNode(this.wrapperRef);
    if (expectedInput === thisInput) {
      this._handleChange(null, null, value);
      setTimeout(callback);
    }
  };

  _handleBlur = (event) => {
    if (this.state.focused) return; // if (event.target.value === '') return;
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
    const {setValue, handleBlur, restrict} = this.props;
    let val = value;
    const isFromEnum = typeof value === 'object';
    if (isFromEnum) {
      val = value.text;
    }
    if (!restrict || (restrict && isFromEnum)) {
      setValue(val);
      this.setState({focused: false, val});
      if (typeof handleBlur === 'function') {
        handleBlur({target: {value: val}});
      }
    }
    if (this.autocompleteRef) {
      this.autocompleteRef.refs.searchTextField.input.blur();
    }
  };

  handleAutoCompleteFocus = () => this.setState({focused: true, val: ''});

  handleAutoCompleteMenuClose = () => this.setState({focused: false});

  getDataSource = () => {
    const {options, secondaryOptions} = this.props;
    return options.map(optionsMapping).concat(secondaryOptions.map(optionsMapping));
  };

  handleMultiselectChange = values => this.props.handleChange(values.map(({value}) => value));

  renderField = () => {
    const {
      getValue,
      multiple,
      options,
      secondaryOptions,
      hideUnderline,
      name,
      autocomplete,
      placeholder,
    } = this.props;
    const {focused, val} = this.state;
    let icon = null;
    if (!focused) {
      const selectedOption = (options.concat(secondaryOptions)).find(({value}) => value === getValue());
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
    };
    if (!autocomplete) {
      Object.assign(labelStyle, {
        padding: '0 48px 0 8px',
      });
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
    if (autocomplete && !multiple) return (
      <span className="SelectComp__autocomplete">
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
          textFieldStyle={labelStyle}
          listStyle={{...style, fontWeight: 400}}
          underlineStyle={underlineStyle}
          menuProps={{desktop: true, maxHeight: 250}}
          onClose={this.handleAutoCompleteMenuClose}
        />
        {icon}
      </span>
    );
    if (autocomplete) return (
      <Multiselect
        name={name}
        options={options.concat(secondaryOptions)}
        value={getValue()}
        multi={multiple}
        onChange={this.handleMultiselectChange}
        placeholder={placeholder}
      />
    );
    const iconStyle = {
      width: 24,
      height: 38,
      border: 0,
      padding: '10px 0 0',
      background: 'linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1), rgba(255, 255, 255, 1))',
    };
    return (
      <SelectField
        value={getValue()}
        multiple={multiple}
        onKeyDown={this._handleKeyDown}
        onBlur={this._handleBlur}
        onChange={this._handleChange}
        autoWidth
        fullWidth
        style={style}
        labelStyle={labelStyle}
        listStyle={{...style, fontWeight: 400}}
        underlineStyle={underlineStyle}
        iconStyle={iconStyle}
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
    const {className, name, autocomplete, multiple} = this.props;
    const multiselect = autocomplete && multiple;
    return (
      <div
        className={cs(className, getPlainText(`select__${name}`), {SelectComp: !multiselect})}
        ref={r => this.wrapperRef = r}
      >
        {this.renderField()}
      </div>
    );
  }
}

export default HOC(Select);
