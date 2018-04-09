import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cs from 'classnames';
import {
  Input,
  Select,
  Checkbox,
  EntityPropertyLabel,
  IconSVG,
  IconButton,
  SmoothCollapse,
  Toolbox,
  CodeEditor,
  Table,
} from '../../';
import getPlainText from '../../utils/getPlainText';
import * as icons from '../../../../../src/icons';
import './EntityProperty.scss';

const {iconDelete, iconRevert} = icons;
const widths = [120, undefined, 50];
const paddings = [true, true, false];
const centers = [false, false, false];

class EntityProperty extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
      PropTypes.array,
      PropTypes.object,
    ]).isRequired,
    title: PropTypes.string,
    placeholder: PropTypes.string,
    invalid: PropTypes.string,
    fake: PropTypes.bool,
    editableOnly: PropTypes.bool,
    password: PropTypes.bool,
    hiddenInputs: PropTypes.array,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func,
    underlineStyle: PropTypes.object,
    onViewModeClick: PropTypes.func,
    onClick: PropTypes.func,
    selected: PropTypes.bool,
    options: PropTypes.array,
    secondaryOptions: PropTypes.array,
    onTab: PropTypes.func,
    width:PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    bool: PropTypes.bool,
    autocomplete: PropTypes.bool,
    codeEditor: PropTypes.bool,
    chips: PropTypes.bool,
    description: PropTypes.string,
    button: PropTypes.node,
    alignRight: PropTypes.bool,
    postfix: PropTypes.string,
    object: PropTypes.bool,
    tmpPrefix: PropTypes.string,
    classes: PropTypes.string,
    slugify: PropTypes.bool,
    type: PropTypes.string,
    noMarginRight: PropTypes.bool,
    icon: PropTypes.string,
  };

  static defaultProps = {
    title: '',
    placeholder: '',
    invalid: '',
    contextual: '',
    fake: false,
    editableOnly: false,
    password: false,
    hiddenInputs: [],
    onChange: () => {},
    onBlur: () => {},
    onResetField: () => {},
    onKeyDown: () => {},
    width: 0,
    bool: false,
    autocomplete: false,
    codeEditor: false,
    chips: false,
    description: '',
    alignRight: false,
    postfix: '',
    object: false,
    classes: '',
    slugify: false,
    icon: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      contextualVisible: false,
      tooltipVisible: false,
    }
  }

  getInputRef = () => this.inputRef;

  handleFocus = () => {
    if (this.props.contextual !== '') {
      this.setState({contextualVisible: true});
    }
  }

  handleBlur = (event) => {
    const {contextual, onBlur} = this.props;
    if (contextual !== '') {
      this.setState({contextualVisible: false});
    }
    onBlur(event);
  }

  handleTab = (event) => {
    const {which, keyCode, shiftKey, target: {value}} = event;
    const {onTab, onBlur, chips, onKeyDown} = this.props;
    if (value.trim() !== '' && chips && typeof onBlur === 'function' && (which === 13 || keyCode === 13)) {
      onBlur(value);
    }
    if (typeof onTab === 'function') {
      if (!((which === 9 || keyCode === 9) && !shiftKey)) return;
      onTab(event);
    }
    onKeyDown(event);
  }

  handleMouseEnter = () => this.setState({tooltipVisible: true});

  handleMouseLeave = () => this.setState({tooltipVisible: false});

  handleObjectAddKey = () => {
    const {value, onChange, tmpPrefix} = this.props;
    onChange({...value, '': ''}, () => setTimeout(() => {
      const input = document.getElementById(`${tmpPrefix}[_]`);
      input && input.focus();
    }));
  };

  handleObjectRemoveKey = key => () => {
    const {value, onChange} = this.props;
    const values = {...value};
    delete values[key];
    onChange(values);
  };

  handleObjectChangeKey = key => ({target: {value: newKey}}) => {
    if (key === newKey) return;
    const {value, onChange} = this.props;
    const values = {...value};
    const val = values[key];
    delete values[key];
    values[newKey] = val;
    onChange(values);
  };

  handleObjectChangeValue = key => ({target: {value: val}}) => {
    const {value, onChange} = this.props;
    onChange({...value, [key]: val});
  };

  handleObjectTab = key => ({which, keyCode, shiftKey}) => {
    if (!((which === 9 || keyCode === 9) && !shiftKey)) return;
    if (Object.keys(this.props.value).pop() !== key) return;
    this.handleObjectAddKey(key);
  }

  handleCodeEditorChange = value => this.props.onBlur({target: {value}});

  renderField = () => {
    const {
      name,
      options,
      secondaryOptions,
      onChange,
      password,
      invalid,
      value,
      placeholder,
      title,
      underlineStyle,
      number,
      bool,
      autocomplete,
      codeEditor,
      chips,
      alignRight,
      object,
      tmpPrefix,
      invalidUnderlineColor,
      slugify,
    } = this.props;
    if (object) {
      const columns = [
        'Key',
        'Value',
        <IconButton
          icon="iconPlus"
          name={`add__${name}Parameter`}
          onClick={this.handleObjectAddKey}
        />,
      ];
      const data = Object.keys(value).map(key => [
        <Input
          name={`${tmpPrefix}[${key || '_'}]`}
          value={key}
          underlineStyle={{bottom: 0}}
          fullWidth
          hideUnderline
          handleBlur={this.handleObjectChangeKey(key)}
        />,
        <Input
          name={`${name}[${key}]`}
          value={value[key]}
          underlineStyle={{bottom: 0}}
          fullWidth
          hideUnderline
          handleBlur={this.handleObjectChangeValue(key)}
          handleKeyDown={this.handleObjectTab(key)}
        />,
        <IconButton icon="iconDelete" onClick={this.handleObjectRemoveKey(key)} />,
      ]);
      return (
        <Table
          columns={columns}
          data={data}
          widths={widths}
          paddings={paddings}
          centers={centers}
        />
      );
    }
    if (codeEditor) {
      return (
        <span className="EntityProperty__field--input">
          <CodeEditor
            name={name}
            value={value}
            onChange={this.handleCodeEditorChange}
            onTab={this.handleTab}
            fullWidth
            initialHeight={200}
          />
        </span>
      );
    }
    if (bool) {
      return (
        <span className="EntityProperty__field--input checkbox">
          <Checkbox
            ref={(r) => {this.inputRef = r;}}
            name={name}
            value={value}
            handleChange={onChange}
            handleKeyDown={this.handleTab}
            label="Enabled"
          />
        </span>
      );
    }
    const isInvalid = invalid !== '';
    const filler = placeholder || `Enter ${title} here`;
    if (options) {
      return (
        <Select
          ref={(r) => {this.inputRef = r;}}
          className="EntityProperty__field--input"
          name={name}
          value={value}
          options={options}
          secondaryOptions={secondaryOptions}
          handleChange={onChange}
          handleBlur={this.handleBlur}
          handleKeyDown={this.handleTab}
          autocomplete={autocomplete}
          multiple={chips}
          placeholder={filler}
        />
      );
    }
    let type = 'text';
    if (password) {
      type = 'password';
    }
    if (number) {
      type = 'number';
    }
    return (
      <Input
        ref={(r) => {this.inputRef = r;}}
        className="EntityProperty__field--input"
        name={name}
        value={chips ? '' : value}
        placeholder={filler}
        handleChange={onChange}
        handleFocus={this.handleFocus}
        handleBlur={this.handleBlur}
        type={type}
        fullWidth
        underlineStyle={underlineStyle}
        isInvalid={isInvalid}
        handleKeyDown={this.handleTab}
        alignRight={alignRight}
        invalidUnderlineColor={invalidUnderlineColor}
        slugify={slugify}
      />
    );
  };

  render() {
    const {
      name,
      options,
      modelName,
      value,
      title,
      placeholder,
      fake,
      invalid,
      contextual,
      editableOnly,
      password,
      hiddenInputs,
      onDelete,
      onViewModeClick,
      isDelta,
      onResetField,
      onClick,
      selected,
      width,
      bool,
      autocomplete,
      codeEditor,
      chips,
      description,
      button,
      postfix,
      object,
      classes,
      type,
      noMarginRight,
      icon,
    } = this.props;
    const {contextualVisible, tooltipVisible} = this.state;
    const isInvalid = invalid !== '';
    const classNames = cs('EntityProperty', type,
    {
      ['EntityProperty__fake']: fake,
      ['EntityProperty__editableOnly']: editableOnly,
      ['EntityProperty__noTitle']: title === '',
      ['EntityProperty__contextual']: contextualVisible,
      ['EntityProperty__invalid']: isInvalid,
      ['EntityProperty__delta']: isDelta,
      ['EntityProperty__selected']: selected,
      ['EntityProperty__codeEditor']: codeEditor,
      ['EntityProperty__withIcon']: icon !== '',
      noMarginRight,
    });
    const filler = placeholder || `Enter ${title} here`;
    let textValue = value || filler;
    if (bool) {
      textValue = value.toString();
    }
    if (object) {
      textValue = '';
    }
    if (password && value.length > 0) {
      textValue = '•'.repeat(value.length);
    }
    if (options && !autocomplete) {
      textValue = (options.find(item => item.value === value) || {label: value}).label;
    }
    if (chips) {
      textValue = hiddenInputs.map(item => item.value).join(', ');
    }
    if (options && chips && autocomplete) {
      textValue = value.join(', ');
    }
    const textValueClassNames = cs('EntityProperty__field--textValue', {
      ['EntityProperty__field--textValue--clickable']: !!onViewModeClick,
    });
    const toolboxConfig = [];
    if (isDelta) {
      toolboxConfig.push({
        action: 'delete',
        svg: iconRevert,
        onClick: onResetField(modelName || name),
      });
    }
    const plainName = getPlainText(name);
    const style = {};
    if (typeof width === 'string' || width > 0) {
      style.width = width;
    }
    return (
      <div
        className={classNames}
        style={style}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {title !== '' && (
          <EntityPropertyLabel description={tooltipVisible ? description : ''}>
            {title}
          </EntityPropertyLabel>
        )}
        <div className={cs('EntityProperty__field', plainName, getPlainText(classes))}>
          <div className='EntityProperty__field--text' onClick={onClick}>
            <span className={textValueClassNames} onClick={onViewModeClick}>
              {textValue}
            </span>
          </div>
          {!fake && this.renderField()}
          {postfix !== '' && <span className="EntityProperty__postfix">{postfix}</span>}
          {hiddenInputs.map((item, idx) => <Input key={idx} type="hidden" value={item.value} name={item.name} />)}
          <Toolbox config={toolboxConfig} />
        </div>
        {onDelete && (
          <div className={cs('EntityProperty__delete', `button__remove__${plainName}`)} onClick={onDelete}>
            <IconSVG svg={iconDelete} />
          </div>
        )}
        {contextual !== '' && (
          <SmoothCollapse expanded={contextualVisible} heightTransition="400ms ease">
            <div className="EntityProperty__context">{contextual}</div>
          </SmoothCollapse>
        )}
        <SmoothCollapse expanded={isInvalid} heightTransition="800ms ease">
          <div className="EntityProperty__error">{invalid}</div>
        </SmoothCollapse>
        {button && (
          <div className="EntityProperty__button">{button}</div>
        )}
        {icon !== '' && (
          <IconSVG svg={icons[icon]} className="EntityProperty__icon" />
        )}
      </div>
    );
  }
}

export default EntityProperty;
