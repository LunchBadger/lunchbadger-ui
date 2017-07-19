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
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PanelContainer from '../Panel/PanelContainer';
import Pluggable from '../../stores/Pluggable';
import AppState from '../../stores/AppState';
import {loadFromServer, saveToServer, clearServer} from '../../utils/serverIo';
import handleFatals from '../../utils/handleFatals';
import {addSystemInformationMessage} from '../../../../lunchbadger-ui/src/actions';
import {toggleHighlight} from '../../reduxActions';
import {SystemInformationMessages, SystemNotifications, SystemDefcon1, TooltipWrapper} from '../../../../lunchbadger-ui/src';
import {getUser} from '../../utils/auth';
import Config from '../../../../../src/config';
import './App.scss';

@DragDropContext(HTML5Backend)
class App extends Component {
  static childContextTypes = {
    lunchbadgerConfig: PropTypes.object,
    loginManager: PropTypes.object,
    multiEnvIndex: PropTypes.number,
    multiEnvDelta: PropTypes.bool,
    multiEnvAmount: PropTypes.number,
  }

  static propTypes = {
    config: PropTypes.object,
    loginManager: PropTypes.object,
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
      multiEnvIndex: this.props.multiEnvIndex,
      multiEnvDelta: this.props.multiEnvDelta,
      multiEnvAmount: this.props.multiEnvAmount,
    };
  }

  componentWillMount() {
    LunchBadgerCore.dispatchRedux = this.props.dispatch;
    Pluggable.addChangeListener(this.reloadPlugins);
    AppState.addChangeListener(this.appStateChange);
    let prm = loadFromServer().then(() => {
      this.setState({loaded: true});
    });
    handleFatals(prm).catch(() => {
      this.setState({loaded: true});
    });
  }

  componentWillUnmount() {
    Pluggable.removeChangeListener(this.reloadPlugins);
    AppState.removeChangeListener(this.appStateChange);
  }

  saveToServer = () => {
    let {
      currentlyOpenedPanel,
      currentElement,
    } = this.props;
    const coreStates = {
      currentlyOpenedPanel,
      currentElement,
    };
    this.setState({loaded: false});
    let prm = saveToServer(coreStates).then(() => {
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
    this.setState({loaded: false});
    let prm = clearServer().then(() => {
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

  handleCanvasClick = () => {
    const {canvasClickEnabled, toggleHighlight} = this.props;
    if (canvasClickEnabled) {
      toggleHighlight(null);
    }
  }

  renderHeader = () => {
    const {currentEditElement} = this.props;
    const username = getUser().profile.preferred_username;
    if (LunchBadgerCore.isMultiEnv) {
      return (
        <HeaderMultiEnv
          ref="header"
          username={username}
          appState={this.state.appState}
          plugins={this.state.pluginsStore}
          saveToServer={this.saveToServer}
          clearServer={this.clearServer}
          disabledMultiEnvMenu={!!currentEditElement || !!this.props.currentlyOpenedPanel}
          headerMenuDisabled={!!currentEditElement}
        />
      );
    }
    return (
      <Header
        ref="header"
        username={username}
        envId={Config.get('envId')}
        plugins={this.state.pluginsStore}
        saveToServer={this.saveToServer}
        clearServer={this.clearServer}
        headerMenuDisabled={!!currentEditElement}
      />
    );
  }

  render() {
    const {
      systemDefcon1Visible,
      systemDefcon1Errors,
      multiEnvDelta,
      multiEnvIndex,
      panelEditingStatus,
      currentlyOpenedPanel,
      toggleHighlight,
      currentEditElement,
    } = this.props;
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
            plugins={this.state.pluginsStore}
            disabled={multiEnvNotDev || !!currentlyOpenedPanel || !!currentEditElement}
            currentEditElement={currentEditElement}
          />
          <div ref="container" className="app__container">
            <div className="app__panel-wrapper">
              <SystemNotifications />
              <div style={multiEnvDeltaStyle}>
                <PanelContainer
                  plugins={this.state.pluginsStore}
                  appState={this.state.appState}
                  canvas={() => this.refs.canvas}
                  header={() => this.refs.header}
                  container={() => this.refs.container}
                />
              </div>
            </div>
            <div style={multiEnvDeltaStyle}>
              <Canvas
                appState={this.state.appState}
                plugins={this.state.pluginsStore}
                ref="canvas"
                multiEnvDelta={multiEnvDelta}
                currentlyOpenedPanel={currentlyOpenedPanel}
                onClick={this.handleCanvasClick}
              />
            </div>
          </div>
          <SystemInformationMessages />
          {systemDefcon1Visible && (
            <SystemDefcon1 errors={systemDefcon1Errors} />
          )}
          <TooltipWrapper />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  panelEditingStatus: PropTypes.bool,
  canvasClickEnabled: PropTypes.bool,
}

const mapStateToProps = state => ({
  systemDefcon1Visible: state.ui.systemDefcon1.visible,
  systemDefcon1Errors: state.ui.systemDefcon1.errors,
  multiEnvIndex: state.ui.multiEnvironments.selected,
  multiEnvDelta: state.ui.multiEnvironments.environments[state.ui.multiEnvironments.selected].delta,
  multiEnvAmount: state.ui.multiEnvironments.environments.length,
  canvasClickEnabled: !state.core.appState.panelEditingStatus && !!state.core.appState.currentElement,
  currentlyOpenedPanel: state.core.appState.currentlyOpenedPanel,
  currentElement: state.core.appState.currentElement,
  currentEditElement: state.core.appState.currentEditElement,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  displaySystemInformationMessage: message => dispatch(addSystemInformationMessage(message)),
  toggleHighlight: element => dispatch(toggleHighlight(element)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
