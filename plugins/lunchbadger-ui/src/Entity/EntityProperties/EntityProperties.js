import React, {PropTypes} from 'react';
import {EntityProperty} from '../../';
import './EntityProperties.scss';

const EntityProperties = ({properties}) => (
  <div className="EntityProperties">
    {properties.map((item, idx) => <EntityProperty key={idx} {...item} />)}
  </div>
);

EntityProperties.propTypes = {
  properties: PropTypes.array.isRequired,
}

export default EntityProperties;
