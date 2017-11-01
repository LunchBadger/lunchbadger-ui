import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {Input, Select, EntityPropertyLabel, IconSVG, SmoothCollapse, Toolbox} from '../../';
import getPlainText from '../../utils/getPlainText';
import {iconDelete, iconRevert} from '../../../../../src/icons';
import './EntityProperty.scss';

class EntityProperty extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
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
    onTab: PropTypes.func,
    width: PropTypes.number,
  }

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
  }

  constructor(props) {
    super(props);
    this.state = {
      contextualVisible: false,
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
    if (typeof this.props.onTab === 'function') {
      if (!((event.which === 9 || event.keyCode === 9) && !event.shiftKey)) return;
      this.props.onTab();
    }
  }

  renderField = () => {
    const {
      name,
      options,
      onChange,
      password,
      invalid,
      value,
      placeholder,
      title,
      underlineStyle,
    } = this.props;
    const isInvalid = invalid !== '';
    const filler = placeholder || `Enter ${title} here`;
    if (options) {
      return <Select
        ref={(r) => {this.inputRef = r;}}
        className="EntityProperty__field--input"
        name={name}
        value={value}
        options={options}
        handleChange={onChange}
        handleKeyDown={this.handleTab}
      />;
    }
    return (
      <Input
        ref={(r) => {this.inputRef = r;}}
        className="EntityProperty__field--input"
        name={name}
        value={value}
        placeholder={filler}
        handleChange={onChange}
        handleFocus={this.handleFocus}
        handleBlur={this.handleBlur}
        type={password ? 'password' : 'text'}
        fullWidth
        underlineStyle={underlineStyle}
        isInvalid={isInvalid}
        handleKeyDown={this.handleTab}
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
    } = this.props;
    const {contextualVisible} = this.state;
    const isInvalid = invalid !== '';
    const classNames = cs('EntityProperty', {
      ['EntityProperty__fake']: fake,
      ['EntityProperty__editableOnly']: editableOnly,
      ['EntityProperty__noTitle']: title === '',
      ['EntityProperty__contextual']: contextualVisible,
      ['EntityProperty__invalid']: isInvalid,
      ['EntityProperty__delta']: isDelta,
      ['EntityProperty__selected']: selected,
    });
    const filler = placeholder || `Enter ${title} here`;
    let textValue = value || filler;
    if (password && value.length > 0) {
      textValue = '•'.repeat(value.length);
    }
    if (options) {
      textValue = options.find(item => item.value === value).label;
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
    if (width > 0) {
      style.width = width;
    }
    return (
      <div className={classNames} style={style}>
        {title !== '' && <EntityPropertyLabel>{title}</EntityPropertyLabel>}
        <div className={cs('EntityProperty__field', plainName)}>
          <div className='EntityProperty__field--text' onClick={onClick}>
            <span className={textValueClassNames} onClick={onViewModeClick}>
              {textValue}
            </span>
          </div>
          {!fake && this.renderField()}
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
      </div>
    );
  }
}

export default EntityProperty;
