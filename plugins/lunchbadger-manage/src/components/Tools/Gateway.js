import React from 'react';
import PropTypes from 'prop-types';
import DeployGateway from '../../actions/CanvasElements/Gateway/deploy';
import {entityIcons, Tool} from '../../../../lunchbadger-ui/src';

const Gateway = ({editedElement}) => (
  <Tool
    icon={entityIcons.Gateway}
    selected={editedElement === 'Gateway'}
    onClick={() => DeployGateway()}
    tooltip="Gateway"
    name="gateway"
  />
);

Gateway.propTypes = {
  editedElement: PropTypes.string,
};

export default Gateway;
