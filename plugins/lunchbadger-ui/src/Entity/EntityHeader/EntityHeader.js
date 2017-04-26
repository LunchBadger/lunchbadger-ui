import React, {Component, PropTypes} from 'react';
import {EntityProperty} from '../../';
import './EntityHeader.scss';

class EntityHeader extends Component {
  getInputNameRef = () => this.inputNameRef.getInputRef();

  render() {
    const {type, name, onNameChange, onToggleExpand} = this.props;
    let icon = type.toLowerCase();
    if (icon.endsWith('endpoint')) {
      icon = icon.replace(/public/, '').replace(/private/, '');
    }
    if (icon === 'api') {
      icon = 'product';
    }
    return (
      <div className="EntityHeader">
        <div className="EntityHeader__icon" onClick={onToggleExpand}>
          <i className={`fa icon-icon-${icon}`} />
        </div>
        <div className="EntityHeader__name">
          <EntityProperty
            ref={(r) => {this.inputNameRef = r;}}
            name="name"
            value={name}
            onChange={onNameChange}
          />
        </div>
      </div>
    );
  }
}

EntityHeader.propTypes = {
  type: PropTypes.string.isRequired,
  onToggleExpand: PropTypes.func.isRequired,
};

export default EntityHeader;
