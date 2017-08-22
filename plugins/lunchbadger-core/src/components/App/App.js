/*eslint no-console:0 */
import React, {Component} from 'react';
import cs from 'classnames';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {Provider} from 'mobx-react';
import Canvas from '../Canvas/Canvas';
import Header from '../Header/Header';
import HeaderMultiEnv from '../Header/HeaderMultiEnv';
import Spinner from './Spinner';
import PanelContainer from '../Panel/PanelContainer';
import {loadFromServer} from '../../reduxActions';
import {Aside, SystemInformationMessages, SystemNotifications, SystemDefcon1, TooltipWrapper} from '../../../../lunchbadger-ui/src';
import {getUser} from '../../utils/auth';
import Config from '../../../../../src/config';
import Connections from '../../stores/Connections';
import './App.scss';

@DragDropContext(HTML5Backend)
class App extends Component {
  static childContextTypes = {
    multiEnvIndex: PropTypes.number,
    multiEnvDelta: PropTypes.bool,
    multiEnvAmount: PropTypes.number,
    paper: PropTypes.object,
  }

  static propTypes = {
    multiEnvIndex: PropTypes.number,
    multiEnvDelta: PropTypes.bool,
    multiEnvAmount: PropTypes.number,
    paper: PropTypes.object,
  }

  getChildContext() {
    const {multiEnvIndex, multiEnvDelta, multiEnvAmount, paper} = this.props;
    return {
      multiEnvIndex,
      multiEnvDelta,
      multiEnvAmount,
      paper,
    };
  }

  componentWillMount() {
    this.props.dispatch(loadFromServer());
  }

  renderHeader = () => {
    const {isEntityEditable} = this.props;
    const username = getUser().profile.preferred_username;
    if (LunchBadgerCore.isMultiEnv) {
      return (
        <HeaderMultiEnv
          ref="header"
          username={username}
          disabledMultiEnvMenu={isEntityEditable || !!this.props.currentlyOpenedPanel}
          headerMenuDisabled={isEntityEditable}
        />
      );
    }
    return (
      <Header
        ref="header"
        username={username}
        envId={Config.get('envId')}
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
      isEntityEditable,
    } = this.props;
    const {isMultiEnv} = LunchBadgerCore;
    const multiEnvDeltaStyle = {
      // filter: multiEnvDelta ? 'grayscale(100%) opacity(70%)' : undefined,
    }
    const multiEnvNotDev = multiEnvIndex > 0;
    return (
      <Provider connectionsStore={Connections}>
        <div>
          <div className={cs('apla', {['multiEnv']: isMultiEnv, multiEnvDelta})} />
          <div className={cs('app', {['multiEnv']: isMultiEnv, multiEnvDelta, multiEnvNotDev})}>
            <Spinner />
            {this.renderHeader()}
            <Aside
              disabled={multiEnvNotDev || !!currentlyOpenedPanel || isEntityEditable}
            />
            <div ref="container" className="app__container">
              <div className="app__panel-wrapper">
                <SystemNotifications />
                <div style={multiEnvDeltaStyle}>
                  <PanelContainer
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
                />
              </div>
            </div>
            <SystemInformationMessages />
            {systemDefcon1Visible && (
              <SystemDefcon1 errors={systemDefcon1Errors} />
            )}
            <TooltipWrapper />
          </div>
          <div className="Debug" id="appDebug">Debug:</div>
        </div>
      </Provider>
    );
  }
}

const selector = createSelector(
  state => state.systemDefcon1.visible,
  state => state.systemDefcon1.errors,
  state => state.multiEnvironments.selected,
  state => state.multiEnvironments.environments[state.multiEnvironments.selected].delta,
  state => state.multiEnvironments.environments.length,
  state => state.states.currentlyOpenedPanel,
  state => state.states.currentElement,
  state => !!state.states.currentEditElement,
  (
    systemDefcon1Visible,
    systemDefcon1Errors,
    multiEnvIndex,
    multiEnvDelta,
    multiEnvAmount,
    currentlyOpenedPanel,
    currentElement,
    isEntityEditable,
  ) => ({
    systemDefcon1Visible,
    systemDefcon1Errors,
    multiEnvIndex,
    multiEnvDelta,
    multiEnvAmount,
    currentlyOpenedPanel,
    currentElement,
    isEntityEditable,
  }),
);

export default connect(selector)(App);
