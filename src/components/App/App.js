import React, {Component} from 'react';
import Aside from '../Aside/Aside';
import Canvas from '../Canvas/Canvas';
import Header from '../Header/Header';
import 'font-awesome/css/font-awesome.css';
import './App.scss';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Notifications from 'react-notify-toast';
import PanelContainer from '../Panel/PanelContainer';

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
            <PanelContainer canvas={() => this.refs.canvas} container={() => this.refs.container}/>
          </div>
          <Canvas ref="canvas"/>
        </div>
        <Notifications />
      </div>
    );
  }
}
