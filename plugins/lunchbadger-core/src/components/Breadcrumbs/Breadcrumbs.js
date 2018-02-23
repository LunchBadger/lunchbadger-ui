import React from 'react';
import WorkspaceStatus from './WorkspaceStatus';
import './Breadcrumbs.scss';

export default ({username, envId}) => (
  <div className="breadcrumbs">
    <span className="breadcrumbs__element username">{username}</span>
    <span className="breadcrumbs__element">{envId}</span>
    <span className="breadcrumbs__element">Canvas</span>
    <WorkspaceStatus />
  </div>
);
