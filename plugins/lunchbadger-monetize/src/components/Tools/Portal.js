import React from 'react';
import PropTypes from 'prop-types';
import DeployPortal from '../../actions/CanvasElements/Portal/deploy';

const {
  UI: {entityIcons, Tool},
} = LunchBadgerCore;

const Portal = ({editedElement}) => (
  <Tool
    icon={entityIcons.Portal}
    selected={editedElement === 'Portal'}
    onClick={() => DeployPortal('Portal')}
    tooltip="Portal"
    name="portal"
  />
);

Portal.propTypes = {
  editedElement: PropTypes.string,
};

export default Portal;
