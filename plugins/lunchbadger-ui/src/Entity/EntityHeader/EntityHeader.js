import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {entityIcons, IconSVG, EntityProperty} from '../../';
import './EntityHeader.scss';

class EntityHeader extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    onToggleExpand: PropTypes.func.isRequired,
  }

  getInputNameRef = () => this.inputNameRef.getInputRef();

  handleNameBlur = event => this.props.onNameBlur('name', event.target.value, event);

  render() {
    const {
      type,
      name,
      onNameChange,
      onToggleExpand,
      invalid,
      slugifyName,
      subtitle,
    } = this.props;
    const underlineStyle = {
      borderColor: '#8dbde2',
    }
    return (
      <div className={cs('EntityHeader', {subtitle})}>
        <div className="EntityHeader__icon" onClick={onToggleExpand}>
          <IconSVG svg={entityIcons[type]}/>
        </div>
        <div className="EntityHeader__name">
          <EntityProperty
            ref={(r) => {this.inputNameRef = r;}}
            name="name"
            value={name}
            onChange={onNameChange}
            onBlur={this.handleNameBlur}
            underlineStyle={underlineStyle}
            invalid={invalid}
            invalidUnderlineColor="#FFF"
            slugify={slugifyName}
          />
          {subtitle && (
            <div className="EntityHeader__subtitle">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default EntityHeader;
