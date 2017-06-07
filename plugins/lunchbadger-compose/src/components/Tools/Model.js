import React from 'react';
import PropTypes from 'prop-types';
import AddModel from '../../actions/CanvasElements/Model/add';
import {entityIcons, Tool} from '../../../../lunchbadger-ui/src';

const {defaultEntityNames} = LunchBadgerCore.utils;

const Model = ({editedElement}) => (
  <Tool
    icon={entityIcons.Model}
    selected={editedElement === defaultEntityNames.Model}
    onClick={() => AddModel()}
    tooltip="Model"
  />
);

Model.propTypes = {
  editedElement: PropTypes.string,
};

export default Model;
