import React from 'react';
import {
  iconEdit,
  iconTrash,
  iconApi,
  iconDataSource,
  iconEndpoint,
  iconGateway,
  iconMicroservice,
  iconModel,
  iconPlus,
  iconPortal,
} from '../../../src/icons';
import './Icons.scss';

const config = [
  {
    section: 'Entity types',
    icons: [iconDataSource, iconModel, iconMicroservice, iconEndpoint, iconGateway, iconApi, iconPortal],
  },
  {
    section: 'Actions',
  },
]

export default () => (
  <div className="Icons">

  </div>
);
