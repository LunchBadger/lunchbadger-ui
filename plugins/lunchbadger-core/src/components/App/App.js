import React, {Component, PropTypes} from 'react';
import Aside from '../Aside/Aside';
import Canvas from '../Canvas/Canvas';
import Header from '../Header/Header';
import './App.scss';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Notifications from 'react-notify-toast';
import PanelContainer from '../Panel/PanelContainer';
import Pluggable from '../../stores/Pluggable';
import AppState from '../../stores/AppState';

@DragDropContext(HTML5Backend)
export default class App extends Component {
  static childContextTypes = {
    lunchbadgerConfig: PropTypes.object,
    loginManager: PropTypes.object
  }

  static propTypes = {
    config: PropTypes.object,
    loginManager: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = {
      pluginsStore: Pluggable,
      appState: AppState
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
      loginManager: this.props.loginManager
    };
  }

  componentWillMount() {
    Pluggable.addChangeListener(this.reloadPlugins);
    AppState.addChangeListener(this.appStateChange);
  }

  componentWillUnmount() {
    Pluggable.removeChangeListener(this.reloadPlugins);
    AppState.removeChangeListener(this.appStateChange);
  }

  render() {
    return (
      <div className="app">
        <Header ref="header" appState={this.state.appState} plugins={this.state.pluginsStore}/>
        <Aside appState={this.state.appState} plugins={this.state.pluginsStore}/>
        <div ref="container" className="app__container">
          <div className="app__panel-wrapper">
            <PanelContainer plugins={this.state.pluginsStore}
                            appState={this.state.appState}
                            canvas={() => this.refs.canvas}
                            header={() => this.refs.header}
                            container={() => this.refs.container}/>
          </div>
          <Canvas appState={this.state.appState} plugins={this.state.pluginsStore} ref="canvas"/>
        </div>
        <Notifications />
      </div>
    );
  }
}
