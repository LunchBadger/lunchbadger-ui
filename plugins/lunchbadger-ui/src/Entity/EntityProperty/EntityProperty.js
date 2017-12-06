import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {
  Input,
  Select,
  Checkbox,
  EntityPropertyLabel,
  IconSVG,
  SmoothCollapse,
  Toolbox,
  CodeEditor,
} from '../../';
import getPlainText from '../../utils/getPlainText';
import {iconDelete, iconRevert} from '../../../../../src/icons';
import './EntityProperty.scss';

class EntityProperty extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
      PropTypes.array,
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
    width: 0,
    bool: false,
    autocomplete: false,
    codeEditor: false,
    chips: false,
    description: '',
    alignRight: false,
    postfix: '',
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
    const {onTab, onBlur, chips} = this.props;
    if (value.trim() !== '' && chips && typeof onBlur === 'function' && (which === 13 || keyCode === 13)) {
      onBlur(value);
    }
    if (typeof onTab === 'function') {
      if (!((which === 9 || keyCode === 9) && !shiftKey)) return;
      onTab(event);
    }
  }

  handleMouseEnter = () => this.setState({tooltipVisible: true});

  handleMouseLeave = () => this.setState({tooltipVisible: false});

  renderField = () => {
    const {
      name,
      options,
      secondaryOptions,
      onBlur,
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
    } = this.props;
    if (codeEditor) {
      return (
        <span className="EntityProperty__field--input">
          <CodeEditor
            name={name}
            value={value}
            onChange={value => onBlur({target: {value}})}
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
      />
    );
  }

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
    } = this.props;
    const {contextualVisible, tooltipVisible} = this.state;
    const isInvalid = invalid !== '';
    const classNames = cs('EntityProperty', {
      ['EntityProperty__fake']: fake,
      ['EntityProperty__editableOnly']: editableOnly,
      ['EntityProperty__noTitle']: title === '',
      ['EntityProperty__contextual']: contextualVisible,
      ['EntityProperty__invalid']: isInvalid,
      ['EntityProperty__delta']: isDelta,
      ['EntityProperty__selected']: selected,
      ['EntityProperty__codeEditor']: codeEditor,
    });
    const filler = placeholder || `Enter ${title} here`;
    let textValue = value || filler;
    if (bool) {
      textValue = value.toString();
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
        <div className={cs('EntityProperty__field', plainName)}>
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
      </div>
    );
  }
}

export default EntityProperty;
