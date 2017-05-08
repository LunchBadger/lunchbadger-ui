/*eslint no-console:0 */
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Aside from '../Aside/Aside';
import Canvas from '../Canvas/Canvas';
import Header from '../Header/Header';
import Spinner from './Spinner';
import './App.scss';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PanelContainer from '../Panel/PanelContainer';
import Pluggable from '../../stores/Pluggable';
import AppState from '../../stores/AppState';
import {loadFromServer, saveToServer, clearServer} from '../../utils/serverIo';
import handleFatals from '../../utils/handleFatals';
import {addSystemInformationMessage} from '../../../../lunchbadger-ui/src/actions';
import {SystemInformationMessages, SystemNotifications} from '../../../../lunchbadger-ui/src';

@DragDropContext(HTML5Backend)
class App extends Component {
  static childContextTypes = {
    lunchbadgerConfig: PropTypes.object,
    loginManager: PropTypes.object,
    projectService: PropTypes.object,
    configStoreService: PropTypes.object,
    workspaceUrl: PropTypes.string
  }

  static propTypes = {
    config: PropTypes.object,
    loginManager: PropTypes.object,
    projectService: PropTypes.object,
    configStoreService: PropTypes.object,
    workspaceUrl: PropTypes.string
  }

  constructor(props) {
    super(props);

    this.state = {
      pluginsStore: Pluggable,
      appState: AppState,
      loaded: false
    };

    this.reloadPlugins = () => {
      this.setState({pluginsStore: Pluggable});
    };

    this.appStateChange = () => {
      this.setState({appState: AppState});
    };
  }

  getChildContext() {
    return {
      lunchbadgerConfig: this.props.config,
      loginManager: this.props.loginManager,
      projectService: this.props.projectService,
      configStoreService: this.props.configStoreService,
      workspaceUrl: this.props.workspaceUrl
    };
  }

  componentWillMount() {
    let {config, loginManager, projectService} = this.props;

    Pluggable.addChangeListener(this.reloadPlugins);
    AppState.addChangeListener(this.appStateChange);

    let prm = loadFromServer(config, loginManager, projectService).then(() => {
      this.setState({loaded: true});
    })

    handleFatals(prm).catch(() => {
      this.setState({loaded: true});
    });
  }

  componentWillUnmount() {
    Pluggable.removeChangeListener(this.reloadPlugins);
    AppState.removeChangeListener(this.appStateChange);
  }

  saveToServer() {
    let {config, loginManager, projectService} = this.props;

    this.setState({loaded: false});
    let prm = saveToServer(config, loginManager, projectService).then(() => {
      this.props.displaySystemInformationMessage({
        message: 'All data has been synced with API',
        type: 'success'
      });
      this.setState({loaded: true});
    });

    handleFatals(prm).catch(() => {
      this.setState({loaded: true});
    });
  }

  clearServer() {
    let {config, loginManager, projectService} = this.props;

    this.setState({loaded: false});

    let prm = clearServer(config, loginManager, projectService).then(() => {
      this.props.displaySystemInformationMessage({
        message: 'All data removed from server',
        type: 'success'
      });
      this.setState({loaded: true});
    });

    handleFatals(prm).catch(() => {
      this.setState({loaded: true});
    });
  }

  render() {
    return (
      <div className="app">
        <Spinner loading={!this.state.loaded} />
        <Header ref="header"
                appState={this.state.appState}
                plugins={this.state.pluginsStore}
                saveToServer={this.saveToServer.bind(this)}
                clearServer={this.clearServer.bind(this)} />
        <Aside appState={this.state.appState} plugins={this.state.pluginsStore}/>
        <div ref="container" className="app__container">
          <div className="app__panel-wrapper">
            <SystemNotifications />
            <PanelContainer plugins={this.state.pluginsStore}
                            appState={this.state.appState}
                            canvas={() => this.refs.canvas}
                            header={() => this.refs.header}
                            container={() => this.refs.container}/>
          </div>
          <Canvas appState={this.state.appState} plugins={this.state.pluginsStore} ref="canvas"/>
        </div>
        <SystemInformationMessages />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  displaySystemInformationMessage: message => dispatch(addSystemInformationMessage(message)),
});

export default connect(null, mapDispatchToProps)(App);
