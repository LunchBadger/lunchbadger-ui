import React, {PropTypes} from 'react';
import {Button} from '../';
import './EntityActionButtons.scss';

const EntityActionButtons = ({onCancel}) => (
  <div className="EntityActionButtons">
    <Button onClick={onCancel}>Cancel</Button>
    <Button type="submit">OK</Button>
  </div>
);

EntityActionButtons.propTypes = {
  onCancel: PropTypes.func,
};

export default EntityActionButtons;
