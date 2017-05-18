import React, {Component, PropTypes} from 'react';
import EventSource from 'eventsource';

class WithContext extends Component {
  static childContextTypes = {
    lunchbadgerConfig: PropTypes.object,
    loginManager: PropTypes.object,
    projectService: PropTypes.object,
    // configStoreService: PropTypes.object,
    // workspaceUrl: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.loginManager = {
      user: {
        profile: {
          preferred_username: 'MockUsername',
        },
      },
    };
    this.lunchbadgerConfig = {
      envId: 'MockEnvId',
    };
    this.projectService = {
      monitorStatus: () => new EventSource(''),
    };
  }

  getChildContext() {
    const {loginManager, lunchbadgerConfig, projectService} = this;
    return {
      loginManager,
      lunchbadgerConfig,
      projectService,
      // configStoreService: this.props.configStoreService,
      // workspaceUrl: this.props.workspaceUrl
    };
  }

  render() {
    const {children} = this.props;
    return (
      <div>
        {children}
      </div>
    );
  }
}

export default story => <WithContext>{story()}</WithContext>;
