import React, {Component, PropTypes} from 'react';
import cs from 'classnames';
import {Input, EntityPropertyLabel, IconSVG, SmoothCollapse} from '../../';
import iconDelete from '../../../../../src/icons/icon-delete.svg';
import './EntityProperty.scss';

class EntityProperty extends Component {
  getInputRef = () => this.inputRef;

  render() {
    const {
      name, value,
      title, placeholder, fake, invalid, editableOnly, password, hiddenInputs,
      onChange, onDelete, onBlur,
    } = this.props;
    const classNames = cs('EntityProperty', {
      ['EntityProperty__fake']: fake,
      ['EntityProperty__editableOnly']: editableOnly,
      ['EntityProperty__noTitle']: title === '',
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
              handleBlur={onBlur}
              type={password ? 'password' : 'text'}
            />
          )}
          {hiddenInputs.map((item, idx) => <Input key={idx} type="hidden" value={item.value} name={item.name}/>)}
        </div>
        {onDelete && (
          <div className="EntityProperty__delete" onClick={onDelete}>
            <IconSVG svg={iconDelete} />
          </div>
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
}

EntityProperty.defaultProps = {
  title: '',
  placeholder: '',
  invalid: '',
  fake: false,
  editableOnly: false,
  password: false,
  hiddenInputs: [],
  onChange: () => {},
}

export default EntityProperty;
