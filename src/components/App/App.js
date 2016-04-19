import React, {Component} from 'react';
import Aside from '../Aside/Aside';
import Canvas from '../Canvas/Canvas';
import Header from '../Header/Header';
import Panel from '../Panel/Panel';
import 'font-awesome/css/font-awesome.css';
import './App.scss';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import AppState from 'stores/AppState';
import Notifications from 'react-notify-toast';

@DragDropContext(HTML5Backend)
export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      panelOpened: false
    };

    this.appStateUpdate = () => {
      this.setState({panelOpened: !!AppState.getStateKey('panelExpanded')});
    }
  }

  componentWillMount() {
    AppState.addChangeListener(this.appStateUpdate);
  }

  componentWillUnmount() {
    AppState.removeChangeListener(this.appStateUpdate);
  }

  render() {
    return (
      <div className="app">
        <Header />
        <Aside />
        <div ref="container" className="app__container">
          <Panel opened={this.state.panelOpened}
                 canvas={() => this.refs.canvas}
                 container={() => this.refs.container}/>
          <Canvas ref="canvas"/>
        </div>
        <Notifications />
      </div>
    );
  }
}
