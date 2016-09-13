/*eslint no-console:0 */
import React, {Component, PropTypes} from 'react';
import Aside from '../Aside/Aside';
import Canvas from '../Canvas/Canvas';
import Header from '../Header/Header';
import Spinner from './Spinner';
import './App.scss';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Notifications, {notify} from 'react-notify-toast';
import PanelContainer from '../Panel/PanelContainer';
import Pluggable from '../../stores/Pluggable';
import AppState from '../../stores/AppState';
import {loadFromServer, saveToServer} from '../../utils/serverIo';

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
      loginManager: this.props.loginManager
    };
  }

  componentWillMount() {
    Pluggable.addChangeListener(this.reloadPlugins);
    AppState.addChangeListener(this.appStateChange);

    loadFromServer(this.props.config, this.props.loginManager).then(() => {
      notify.show('All data has been synced with API', 'success');
      this.setState({loaded: true});
    }).catch(err => {
      console.error(err);
      notify.show('Failed to sync data with API, working offline! Try to refresh page...', 'error');
      this.setState({loaded: true});
    });
  }

  componentWillUnmount() {
    Pluggable.removeChangeListener(this.reloadPlugins);
    AppState.removeChangeListener(this.appStateChange);
  }

  saveToServer() {
    this.setState({loaded: false});
    saveToServer(this.props.config, this.props.loginManager).then(() => {
      notify.show('All data has been synced with API', 'success');
      this.setState({loaded: true});
    }).catch(err => {
      console.error(err);
      notify.show('Cannot save data to local API', 'error');
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
                saveToServer={this.saveToServer.bind(this)} />
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
