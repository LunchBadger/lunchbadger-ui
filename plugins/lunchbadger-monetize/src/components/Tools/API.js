import React from 'react';
import PropTypes from 'prop-types';
import AddAPI from '../../actions/CanvasElements/API/add';

const {
  UI: {entityIcons, Tool},
} = LunchBadgerCore;

const API = ({editedElement}) => (
  <Tool
    icon={entityIcons.API}
    selected={editedElement === 'API'}
    onClick={() => AddAPI('API')}
    tooltip="API"
    name="api"
  />
);

API.propTypes = {
  editedElement: PropTypes.string,
};

export default API;
