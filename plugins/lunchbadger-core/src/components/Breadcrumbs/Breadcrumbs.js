import React, {Component, PropTypes} from 'react';
import './Breadcrumbs.scss';

export default class Breadcrumbs extends Component {
  static contextTypes = {
    lunchbadgerConfig: PropTypes.object,
    loginManager: PropTypes.object
  }

  render() {
    return (
      <div className="breadcrumbs">
        <span className="breadcrumbs__element">{this.context.loginManager.user.profile.preferred_username}</span>
        <span className="breadcrumbs__element">{this.context.lunchbadgerConfig.envId}</span>
        <span className="breadcrumbs__element">Canvas</span>
      </div>
    );
  }
}
