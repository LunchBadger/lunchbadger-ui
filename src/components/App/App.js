import React, {Component} from 'react';
import Aside from '../Aside/Aside';
import Canvas from '../Canvas/Canvas';
import Header from '../Header/Header';
import './App.scss';

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
