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
import {getUser} from '../../utils/auth';
import {setEntitiesStatus} from '../../reduxActions';
import './AppLoader.scss';

const envId = Config.get('envId');

class AppLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      workspaceRunning: false,
      error: null,
      workspaceError: false,
    };
  }

  componentWillMount() {
    this.load();
  }

  componentDidMount() {
    this.kubeWatcherMonitor = KubeWatcherService.monitorStatuses();
    this.kubeWatcherMonitor.addEventListener('message', this.onKubeWatcherData);
  }

  componentWillUnmount() {
    if (this.kubeWatcherMonitor) {
      this.kubeWatcherMonitor.close();
      this.kubeWatcherMonitor = null;
    }
  }

  onKubeWatcherData = (message) => {
    const projectSlug = `-${getUser().profile.sub}-${envId}-`;
    const data = JSON.parse(message.data)[envId];
    let workspaceRunning = false;
    if (data.workspace) {
      workspaceRunning = Object.values(data.workspace).reduce((prev, {status: {running}}) => prev || running, false);
    }
    this.setState({workspaceRunning});
    const entitiesData = {...data};
    delete entitiesData.workspace;
    const entitiesStatus = {};
    Object.keys(entitiesData).forEach((entity) => {
      entitiesStatus[entity] = {};
      Object.keys(entitiesData[entity]).forEach((key) => {
        const entitySlugArr = key.replace(`${entity}${projectSlug}`, '').split('-');
        const entitySlugName = entitySlugArr.slice(0, entitySlugArr.length - 2).join('-');
        entitiesStatus[entity][entitySlugName] = entitiesData[entity][key].status.running;
      });
    });
    if (this.prevEntitiesStatus !== JSON.stringify(entitiesStatus)) {
      this.prevEntitiesStatus = JSON.stringify(entitiesStatus);
      this.props.dispatch(setEntitiesStatus(entitiesStatus));
    }
  };

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
