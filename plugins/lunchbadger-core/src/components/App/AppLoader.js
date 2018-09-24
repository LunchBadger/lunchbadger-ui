import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import App from './App';
import Spinner from './Spinner';
import ProjectService from '../../services/ProjectService';
import ConfigStoreService from '../../services/ConfigStoreService';
import {SystemDefcon1} from '../../../../lunchbadger-ui/src';
import paper from '../../utils/paper';
import LoginManager from '../../utils/auth';
import recordedMocks from '../../utils/recordedMocks';
import KubeWatcherService from '../../services/KubeWatcherService';
import Config from '../../../../../src/config';
import {actions} from '../../reduxActions/actions';
import {updateEntitiesStatues} from '../../reduxActions';
import './AppLoader.scss';

const envId = Config.get('envId');
const pingAmount = Config.get('pingAmount');
const pingIntervalMs = Config.get('pingIntervalMs');
const isKubeWatcherEnabled = Config.get('features').kubeWatcher;
const mocks = Config.get('mocks');

const allowedPingStatuses = [
  0,
  404,
  502,
  503,
  504,
];

class AppLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      workspaceRunning: !isKubeWatcherEnabled,
      error: null,
      workspaceError: false,
    };
    this.kubeWatcherStarted = false;
  }

  componentWillMount() {
    setTimeout(() => this.load(), 100);
  }

  componentDidMount() {
    if (isKubeWatcherEnabled) {
      if (mocks) {
        this.onKubeWatcherData(recordedMocks('EventStream', 'KubeWatcher'));
      } else {
        this.initKubeWatcher();
      }
    }
    window.addEventListener('keydown', this.blockKeyPressWhenWorkspaceNotRunning);
  }

  componentWillUnmount() {
    if (this.kubeWatcherMonitor) {
      this.kubeWatcherMonitor.close();
      this.kubeWatcherMonitor = null;
    }
    window.removeEventListener('keydown', this.blockKeyPressWhenWorkspaceNotRunning);
  }

  blockKeyPressWhenWorkspaceNotRunning = (event) => {
    if (this.state.workspaceRunning) return;
    event.stopPropagation();
    event.preventDefault();
  };

  initKubeWatcher = () => {
    if (this.kubeWatcherMonitor) {
      this.kubeWatcherMonitor.close();
    }
    if (!+window.localStorage.getItem('logoutCalled')) {
      this.kubeWatcherMonitor = KubeWatcherService.monitorStatuses();
      this.kubeWatcherMonitor.addEventListener('message', this.onKubeWatcherData);
      this.kubeWatcherMonitor.addEventListener('error', this.onKubeWatcherError);
    }
  };

  onKubeWatcherData = (message) => {
    const data = JSON.parse(message.data)[envId];
    let workspaceRunning = false;
    if (data.workspace) {
      workspaceRunning = Object.values(data.workspace)
        .reduce((prev, {status: {running}}) => prev || running, false);
    }
    this.setState({workspaceRunning});
    if (!this.kubeWatcherStarted && workspaceRunning) {
      this.kubeWatcherStarted = true;
    }
    if (this.prevMessage !== message.data) {
      this.prevMessage = message.data;
      this.props.dispatch(actions.setEntitiesStatuses(data));
      this.props.dispatch(updateEntitiesStatues());
      console.log('Status from kubeWatcher', data);
    }
  };

  onKubeWatcherError = (event) => {
    this.setState({workspaceRunning: false});
    if (event && event.status === 401) {
      LoginManager().refreshLogin();
      return;
    }
    setTimeout(() => this.initKubeWatcher(), 1000);
  };

  load() {
    ConfigStoreService.upsertProject()
      .then(() => {
        return waitForProject(pingAmount, pingIntervalMs);
      })
      .then(() => {
        this.setState({loaded: true});
        // Setting the projectState will trigger the App render, which will
        // in turn trigger the remote call to the server. This creates some
        // Promises that do not get returned all the way here. As a result,
        // we'll get a warning from Bluebird. Returning null here suppresses
        // that warning.
        return null;
      })
      .catch(error => {
        this.setState({error});
      });

    function waitForProject(retries, waitTime) {
      //console.log('Pinging workspace');
      return ProjectService
        .ping()
        .catch(err => {
          if (!allowedPingStatuses.includes(err.statusCode)) {
            throw err;
          }
          if (retries > 1) {
            //console.log(`Workspace not ready, trying again in ${waitTime}ms`);
            return new Promise(resolve => {
              setTimeout(resolve, waitTime);
            }).then(() => {
              return waitForProject(retries - 1, waitTime);
            });
          } else {
            //console.log('Timed out waiting for workspace');
            throw err;
          }
        });
    }
  }

  renderLoadingScreen() {
    return (
      <div className="app">
        <Spinner force />
        <div className="app__loading-message">
          Baking your workspace, please wait...
        </div>
      </div>
    );
  }

  renderError() {
    const error = this.state.error;
    return (
      <div className="app">
        <div className="app__loading-error">
          <SystemDefcon1 server errors={[{error: {error}}]} />
        </div>
      </div>
    );
  }

  renderApp() {
    const {workspaceRunning} = this.state;
    return (
      <App
        paper={paper}
        blocked={!workspaceRunning}
      />
    );
  }

  render() {
    const {loaded, error} = this.state;
    if (loaded && this.kubeWatcherStarted) {
      return this.renderApp();
    } else if (error) {
      return this.renderError();
    } else {
      return this.renderLoadingScreen();
    }
  }
}

export default connect()(AppLoader);
