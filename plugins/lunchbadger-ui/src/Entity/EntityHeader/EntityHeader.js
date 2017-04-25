import React, {PropTypes} from 'react';
import './EntityHeader.scss';

const EntityHeader = ({icon, onToggleExpand}) => (
  <div className="EntityHeader">
    <div className="EntityHeader__icon" onClick={onToggleExpand}>
      <i className={`fa ${icon}`}/>
    </div>
    EntityHeader
  </div>
);

EntityHeader.propTypes = {
  icon: PropTypes.string.isRequired,
  onToggleExpand: PropTypes.func.isRequired,
};

export default EntityHeader;
