import React from 'react';
import PropTypes from 'prop-types';
import AddAPI from '../../actions/CanvasElements/API/add';
import {entityIcons, Tool} from '../../../../lunchbadger-ui/src';

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
