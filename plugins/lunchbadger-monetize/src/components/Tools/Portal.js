import React from 'react';
import PropTypes from 'prop-types';
import DeployPortal from '../../actions/CanvasElements/Portal/deploy';
import {entityIcons, Tool} from '../../../../lunchbadger-ui/src';

const Portal = ({editedElement}) => (
  <Tool
    icon={entityIcons.Portal}
    selected={editedElement === 'Portal'}
    onClick={() => DeployPortal('Portal')}
  />
);

Portal.propTypes = {
  editedElement: PropTypes.string,
};

export default Portal;
