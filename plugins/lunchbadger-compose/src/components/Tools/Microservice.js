import React from 'react';
import PropTypes from 'prop-types';
import AddMicroservice from '../../actions/CanvasElements/Microservice/add';
import {entityIcons, Tool} from '../../../../lunchbadger-ui/src';

const Microservice = ({editedElement}) => (
  <Tool
    icon={entityIcons.Microservice}
    selected={editedElement === 'Microservice'}
    onClick={() => AddMicroservice()}
    tooltip="Microservice"
    name="microservice"
  />
);

Microservice.propTypes = {
  editedElement: PropTypes.string,
};

export default Microservice;
