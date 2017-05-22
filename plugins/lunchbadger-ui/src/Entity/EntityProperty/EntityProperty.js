import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {Input, EntityPropertyLabel, IconSVG, SmoothCollapse} from '../../';
import iconDelete from '../../../../../src/icons/icon-delete.svg';
import './EntityProperty.scss';

class EntityProperty extends Component {
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

  render() {
    const {
      name,
      value,
      title,
      placeholder,
      fake,
      invalid,
      contextual,
      editableOnly,
      password,
      hiddenInputs,
      onChange,
      onDelete,
      onBlur,
      underlineStyle,
      underlineFocusStyle,
    } = this.props;
    const {contextualVisible} = this.state;
    const classNames = cs('EntityProperty', {
      ['EntityProperty__fake']: fake,
      ['EntityProperty__editableOnly']: editableOnly,
      ['EntityProperty__noTitle']: title === '',
      ['EntityProperty__contextual']: contextualVisible,
      ['EntityProperty__invalid']: invalid !== '',
    });
    const filler = placeholder || `Enter ${title} here`;
    let textValue = value || filler;
    if (password && value.length > 0) {
      textValue = '•'.repeat(value.length);
    }
    return (
      <div className={classNames}>
        {title !== '' && <EntityPropertyLabel>{title}</EntityPropertyLabel>}
        <div className="EntityProperty__field">
          <div className="EntityProperty__field--text">
            {textValue}
          </div>
          {!fake && (
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
              underlineFocusStyle={underlineFocusStyle}
            />
          )}
          {hiddenInputs.map((item, idx) => <Input key={idx} type="hidden" value={item.value} name={item.name}/>)}
        </div>
        {onDelete && (
          <div className="EntityProperty__delete" onClick={onDelete}>
            <IconSVG svg={iconDelete} />
          </div>
        )}
        {contextual !== '' && (
          <SmoothCollapse expanded={contextualVisible} heightTransition="400ms ease">
            <div className="EntityProperty__context">{contextual}</div>
          </SmoothCollapse>
        )}
        <SmoothCollapse expanded={invalid !== ''} heightTransition="800ms ease">
          <div className="EntityProperty__error">{invalid}</div>
        </SmoothCollapse>
      </div>
    );
  }
}

EntityProperty.propTypes = {
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
  underlineFocusStyle: PropTypes.object,
}

EntityProperty.defaultProps = {
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
}

export default EntityProperty;
