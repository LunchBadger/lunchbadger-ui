import {Component, PropTypes} from 'react';
import App from './App';
import Spinner from './Spinner';
import ProjectService from '../../services/ProjectService';
import {SystemDefcon1} from '../../../../lunchbadger-ui/src';
import './AppLoader.scss';

export default class AppLoader extends Component {
  static propTypes = {
    configStoreService: PropTypes.object,
    config: PropTypes.object,
    loginManager: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = {
      projectService: null,
      error: null
    };
  }

  componentWillMount() {
    this.load();
  }

  load() {
    let {loginManager, config} = this.props;

    let {workspaceApiUrl, projectApiUrl, envId} = config;
    let userId = loginManager.user.profile.sub;
    let idToken = loginManager.user.id_token;

    let mkUrl = url => url.replace('{USER}', userId).replace('{ENV}', envId);

    let projectService = new ProjectService(mkUrl(projectApiUrl),
                                            mkUrl(workspaceApiUrl), idToken);
    let workspaceUrl = mkUrl(config.workspaceUrl);

    this.props.configStoreService.upsertProject(userId)
      .then(() => {
        return waitForProject(48, 2500);
      })
      .then(() => {
        this.setState({projectService, workspaceUrl});
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
      return projectService
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
        <Spinner />
        <div className='app__loading-message'>
          Baking your workspace, please wait...
        </div>
      </div>
    );
  }

  renderError() {
    return (
      <div className='app'>
        <SystemDefcon1 server error={this.state.error.message} />
      </div>
    );
  }

  renderApp() {
    return <App config={this.props.config}
                loginManager={this.props.loginManager}
                projectService={this.state.projectService}
                configStoreService={this.props.configStoreService}
                workspaceUrl={this.state.workspaceUrl} />;
  }

  render() {
    if (this.state.projectService) {
      return this.renderApp();
    } else if (this.state.error) {
      return this.renderError();
    } else {
      return this.renderLoadingScreen();
    }
  }
}
