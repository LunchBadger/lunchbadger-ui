import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import WorkspaceStatus from './WorkspaceStatus';
import './Breadcrumbs.scss';

class Breadcrumbs extends PureComponent {
  render() {
    const {username, envId, loadedProject} = this.props;
    return (
      <div className="breadcrumbs">
        <span className="breadcrumbs__element username">{username}</span>
        <span className="breadcrumbs__element">{envId}</span>
        <span className="breadcrumbs__element">Canvas</span>
        <span className="status">
          {loadedProject && <WorkspaceStatus />}
        </span>
      </div>
    );
  }
}

const selector = createSelector(
  state => state.loadedProject,
  loadedProject => ({loadedProject}),
);

export default connect(selector)(Breadcrumbs);
