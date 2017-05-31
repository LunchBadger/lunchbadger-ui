/*eslint no-console:0 */
import React, {Component} from 'react';
import cs from 'classnames';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Aside from '../Aside/Aside';
import Canvas from '../Canvas/Canvas';
import Header from '../Header/Header';
import HeaderMultiEnv from '../Header/HeaderMultiEnv';
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
import {SystemInformationMessages, SystemNotifications, SystemDefcon1} from '../../../../lunchbadger-ui/src';

@DragDropContext(HTML5Backend)
class App extends Component {
  static childContextTypes = {
    lunchbadgerConfig: PropTypes.object,
    loginManager: PropTypes.object,
    projectService: PropTypes.object,
    configStoreService: PropTypes.object,
    workspaceUrl: PropTypes.string,
    multiEnvIndex: PropTypes.number,
    multiEnvDelta: PropTypes.bool,
    multiEnvAmount: PropTypes.number,
  }

  static propTypes = {
    config: PropTypes.object,
    loginManager: PropTypes.object,
    projectService: PropTypes.object,
    configStoreService: PropTypes.object,
    workspaceUrl: PropTypes.string,
    multiEnvIndex: PropTypes.number,
    multiEnvDelta: PropTypes.bool,
    multiEnvAmount: PropTypes.number,
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
      workspaceUrl: this.props.workspaceUrl,
      multiEnvIndex: this.props.multiEnvIndex,
      multiEnvDelta: this.props.multiEnvDelta,
      multiEnvAmount: this.props.multiEnvAmount,
    };
  }

  componentWillMount() {
    let {config, loginManager, projectService, dispatch} = this.props;

    LunchBadgerCore.dispatchRedux = dispatch;

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

  saveToServer = () => {
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

  clearServer = () => {
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

  renderHeader = () => {
    if (LunchBadgerCore.isMultiEnv) {
      return (
        <HeaderMultiEnv ref="header"
                appState={this.state.appState}
                plugins={this.state.pluginsStore}
                saveToServer={this.saveToServer}
                clearServer={this.clearServer} />
      );
    }
    return (
      <Header ref="header"
              appState={this.state.appState}
              plugins={this.state.pluginsStore}
              saveToServer={this.saveToServer}
              clearServer={this.clearServer} />
    );
  }

  render() {
    const {systemDefcon1Error, multiEnvDelta, multiEnvIndex} = this.props;
    const {isMultiEnv} = LunchBadgerCore;
    const multiEnvDeltaStyle = {
      // filter: multiEnvDelta ? 'grayscale(100%) opacity(70%)' : undefined,
    }
    const multiEnvNotDev = multiEnvIndex > 0;
    return (
      <div>
        <div className={cs('apla', {['multiEnv']: isMultiEnv, multiEnvDelta})} />
        <div className={cs('app', {['multiEnv']: isMultiEnv, multiEnvDelta, multiEnvNotDev})}>
          <Spinner loading={!this.state.loaded} />
          {this.renderHeader()}
          <Aside
            appState={this.state.appState}
            plugins={this.state.pluginsStore}
            disabled={multiEnvNotDev}
          />
          <div ref="container" className="app__container">
            <div className="app__panel-wrapper">
              <SystemNotifications />
              <div style={multiEnvDeltaStyle}>
                <PanelContainer plugins={this.state.pluginsStore}
                                appState={this.state.appState}
                                canvas={() => this.refs.canvas}
                                header={() => this.refs.header}
                                container={() => this.refs.container}/>
              </div>
            </div>
            <div style={multiEnvDeltaStyle}>
              <Canvas
                appState={this.state.appState}
                plugins={this.state.pluginsStore}
                ref="canvas"
                multiEnvDelta={multiEnvDelta}
              />
            </div>
          </div>
          <SystemInformationMessages />
          {systemDefcon1Error !== '' && (
            <SystemDefcon1 error={systemDefcon1Error} />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  systemDefcon1Error: state.ui.systemDefcon1,
  multiEnvIndex: state.ui.multiEnvironments.selected,
  multiEnvDelta: state.ui.multiEnvironments.environments[state.ui.multiEnvironments.selected].delta,
  multiEnvAmount: state.ui.multiEnvironments.environments.length,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  displaySystemInformationMessage: message => dispatch(addSystemInformationMessage(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
