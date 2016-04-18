import React, {Component} from 'react';
import Aside from '../Aside/Aside';
import Canvas from '../Canvas/Canvas';
import Header from '../Header/Header';
import 'font-awesome/css/font-awesome.css';
import './App.scss';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragDropContext(HTML5Backend)
export default class App extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <Aside />
        <div className="app__container">
          <Canvas />
        </div>
      </div>
    );
  }
}
