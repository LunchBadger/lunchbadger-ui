import React, {Component} from 'react';
import PropTypes from 'prop-types';
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
    const {type, name, onNameChange, onToggleExpand, invalid} = this.props;
    const underlineStyle = {
      borderColor: '#8dbde2',
    }
    return (
      <div className="EntityHeader">
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
          />
        </div>
      </div>
    );
  }
}

export default EntityHeader;
