import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import App from './App';
import Spinner from './Spinner';
import ProjectService from '../../services/ProjectService';
import ConfigStoreService from '../../services/ConfigStoreService';
import {SystemDefcon1} from '../../../../lunchbadger-ui/src';
import paper from '../../utils/paper';
import KubeWatcherService from '../../services/KubeWatcherService';
import Config from '../../../../../src/config';
import {actions} from '../../reduxActions/actions';
import {updateEntitiesStatues} from '../../reduxActions';
import './AppLoader.scss';

const envId = Config.get('envId');
const isKubeWatcherEnabled = Config.get('features').kubeWatcher;

class AppLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      workspaceRunning: !isKubeWatcherEnabled,
      error: null,
      workspaceError: false,
    };
  }

  componentWillMount() {
    this.load();
  }

  componentDidMount() {
    if (isKubeWatcherEnabled) {
      this.kubeWatcherMonitor = KubeWatcherService.monitorStatuses();
      this.kubeWatcherMonitor.addEventListener('message', this.onKubeWatcherData);
      this.kubeWatcherMonitor.addEventListener('error', this.onKubeWatcherError);
    }
  }

  componentWillUnmount() {
    if (this.kubeWatcherMonitor) {
      this.kubeWatcherMonitor.close();
      this.kubeWatcherMonitor = null;
    }
  }

  onKubeWatcherData = (message) => {
    const data = JSON.parse(message.data)[envId];
    let workspaceRunning = false;
    if (data.workspace) {
      workspaceRunning = Object.values(data.workspace).reduce((prev, {status: {running}}) => prev || running, false);
    }
    this.setState({workspaceRunning});
    if (this.prevMessage !== message.data) {
      this.prevMessage = message.data;
      this.props.dispatch(actions.setEntitiesStatuses(data));
      this.props.dispatch(updateEntitiesStatues());
      console.log('Status from kubeWatcher', data);
    }
  };

  onKubeWatcherError = () => this.setState({workspaceRunning: false});

  load() {
    ConfigStoreService.upsertProject()
      .then(() => {
        return waitForProject(48, 2500);
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
          if (![0, 404, 502, 504].includes(err.statusCode)) {
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
      <div className='app'>
        <Spinner force />
        <div className='app__loading-message'>
          Baking your workspace, please wait...
        </div>
      </div>
    );
  }

  renderError() {
    return (
      <div className='app'>
        <SystemDefcon1 server errors={[this.state.error.message]} />
      </div>
    );
  }

  renderApp() {
    return <App paper={paper} />;
  }

  render() {
    const {loaded, workspaceRunning, error} = this.state;
    if (loaded && workspaceRunning) {
      return this.renderApp();
    } else if (error) {
      return this.renderError();
    } else {
      return this.renderLoadingScreen();
    }
  }
}

export default connect()(AppLoader);
