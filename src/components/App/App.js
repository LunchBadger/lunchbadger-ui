import React, {Component} from 'react';
import Aside from '../Aside/Aside';
import Canvas from '../Canvas/Canvas';
import Header from '../Header/Header';
import Panel from '../Panel/Panel';
import 'font-awesome/css/font-awesome.css';
import './App.scss';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Notifications from 'react-notify-toast';
import panelKeys from 'constants/panelKeys';

@DragDropContext(HTML5Backend)
export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="app">
        <Header />
        <Aside />
        <div ref="container" className="app__container">
          <div className="app__panel-wrapper">
            <Panel canvas={() => this.refs.canvas}
                   title="Details"
                   storageKey={panelKeys.DETAILS_PANEL}
                   container={() => this.refs.container}/>
            <Panel canvas={() => this.refs.canvas}
                   title="Metrics"
                   storageKey={panelKeys.METRICS_PANEL}
                   container={() => this.refs.container}/>
            <Panel canvas={() => this.refs.canvas}
                   title="Forecasts"
                   storageKey={panelKeys.FORECASTS_PANEL}
                   container={() => this.refs.container}/>
          </div>
          <Canvas ref="canvas"/>
        </div>
        <Notifications />
      </div>
    );
  }
}
