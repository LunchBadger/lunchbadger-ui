import React, {Component} from 'react';
import Quadrant from './../Quadrant/Quadrant';
import './Canvas.scss';

export default class Canvas extends Component {
  render() {
    return (
      <section className="canvas">
        <div className="canvas__container">
          <Quadrant resizable title="Backend"/>
          <Quadrant resizable title="Private"/>
          <Quadrant resizable title="Gateways"/>
          <Quadrant title="Public"/>
        </div>
      </section>
    );
  }
}
