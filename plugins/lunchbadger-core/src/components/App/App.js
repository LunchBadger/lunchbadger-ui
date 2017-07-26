/*eslint no-console:0 */
import React, {Component} from 'react';
import cs from 'classnames';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
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
import {saveToServer, clearServer} from '../../utils/serverIo';
import handleFatals from '../../utils/handleFatals';
import {addSystemInformationMessage} from '../../../../lunchbadger-ui/src/actions';
import {loadFromServer} from '../../reduxActions';
import {SystemInformationMessages, SystemNotifications, SystemDefcon1, TooltipWrapper} from '../../../../lunchbadger-ui/src';
import {getUser} from '../../utils/auth';
import Config from '../../../../../src/config';
import './App.scss';

@DragDropContext(HTML5Backend)
class App extends Component {
  static childContextTypes = {
    multiEnvIndex: PropTypes.number,
    multiEnvDelta: PropTypes.bool,
    multiEnvAmount: PropTypes.number,
  }

  static propTypes = {
    multiEnvIndex: PropTypes.number,
    multiEnvDelta: PropTypes.bool,
    multiEnvAmount: PropTypes.number,
  }

  constructor(props) {
    super(props);

    this.state = {
      pluginsStore: Pluggable,
      appState: AppState,
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
      multiEnvIndex: this.props.multiEnvIndex,
      multiEnvDelta: this.props.multiEnvDelta,
      multiEnvAmount: this.props.multiEnvAmount,
    };
  }

  componentWillMount() {
    this.props.dispatch(loadFromServer());
    LunchBadgerCore.dispatchRedux = this.props.dispatch;
    Pluggable.addChangeListener(this.reloadPlugins);
    AppState.addChangeListener(this.appStateChange);
    // let prm = loadFromServer().then(() => {
    // });
    // handleFatals(prm).catch(() => {
    // });
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
    let prm = saveToServer(coreStates).then(() => {
      this.props.displaySystemInformationMessage({
        message: 'All data has been synced with API',
        type: 'success'
      });
    });
    handleFatals(prm).catch(() => {
    });
  }

  clearServer = () => {
    let prm = clearServer().then(() => {
      this.props.displaySystemInformationMessage({
        message: 'All data removed from server',
        type: 'success'
      });
    });
    handleFatals(prm).catch(() => {
    });
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
      currentlyOpenedPanel,
      currentEditElement,
      loading,
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
          <Spinner loading={loading} />
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
                ref="canvas"
                multiEnvDelta={multiEnvDelta}
                currentlyOpenedPanel={currentlyOpenedPanel}
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

const selector = createSelector(
  state => state.ui.systemDefcon1.visible,
  state => state.ui.systemDefcon1.errors,
  state => state.ui.multiEnvironments.selected,
  state => state.ui.multiEnvironments.environments[state.ui.multiEnvironments.selected].delta,
  state => state.ui.multiEnvironments.environments.length,
  state => state.core.appState.currentlyOpenedPanel,
  state => state.core.appState.currentElement,
  state => state.core.appState.currentEditElement,
  state => state.core.loadingProject > 0,
  (
    systemDefcon1Visible,
    systemDefcon1Errors,
    multiEnvIndex,
    multiEnvDelta,
    multiEnvAmount,
    currentlyOpenedPanel,
    currentElement,
    currentEditElement,
    loading,
  ) => ({
    systemDefcon1Visible,
    systemDefcon1Errors,
    multiEnvIndex,
    multiEnvDelta,
    multiEnvAmount,
    currentlyOpenedPanel,
    currentElement,
    currentEditElement,
    loading,
  }),
);

const mapDispatchToProps = dispatch => ({
  dispatch,
  displaySystemInformationMessage: message => dispatch(addSystemInformationMessage(message)),
});

export default connect(selector, mapDispatchToProps)(App);
