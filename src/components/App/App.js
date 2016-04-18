import React, {Component} from 'react';
import Aside from '../Aside/Aside';
import Canvas from '../Canvas/Canvas';
import Header from '../Header/Header';
import Panel from '../Panel/Panel';
import 'font-awesome/css/font-awesome.css';
import './App.scss';

export default class App extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <Aside />
        <div className="app__container">
          <Panel opened={false} canvas={() => this.refs.canvas}/>
          <Canvas ref="canvas"/>
        </div>
      </div>
    );
  }
}
