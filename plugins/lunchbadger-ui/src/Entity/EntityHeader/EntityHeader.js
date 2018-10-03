import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {
  entityIcons,
  IconSVG,
  EntityProperty,
  ContextualInformationMessage,
  labels,
} from '../../';
import './EntityHeader.scss';

class EntityHeader extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    onToggleExpand: PropTypes.func.isRequired,
    locked: PropTypes.bool,
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
      locked,
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
        {locked && (
          <ContextualInformationMessage
            tooltip={labels.LOCKED_MESSAGE}
            direction="bottom"
          >
            <i className="locked fa fa-lock" />
          </ContextualInformationMessage>
        )}
      </div>
    );
  }
}

export default EntityHeader;
