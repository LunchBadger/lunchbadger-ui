import React from 'react';
import PropTypes from 'prop-types';
import AddPrivateEndpoint from '../../actions/CanvasElements/PrivateEndpoint/add';
import AddPublicEndpoint from '../../actions/CanvasElements/PublicEndpoint/add';
import {entityIcons, Tool} from '../../../../lunchbadger-ui/src';

const Endpoint = ({editedElement}) => {
  const submenu = [
    {
      label: 'Private',
      name: 'privateendpoint',
      icon: entityIcons.PrivateEndpoint,
      onClick: () => AddPrivateEndpoint('PrivateEndpoint'),
    },
    {
      label: 'Public',
      name: 'publicendpoint',
      icon: entityIcons.PrivateEndpoint,
      onClick: () => AddPublicEndpoint('PublicEndpoint'),
    },
  ];
  return (
    <Tool
      icon={entityIcons.PrivateEndpoint}
      selected={editedElement.endsWith('Endpoint')}
      submenu={submenu}
      plain
      tooltip="Endpoint"
      name="endpoint"
    />
  );
}

Endpoint.propTypes = {
  editedElement: PropTypes.string,
};

export default Endpoint;
