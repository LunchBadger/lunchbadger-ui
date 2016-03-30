import React, {Component} from 'react';
import Quadrant from './Quadrant';
import './Canvas.scss';

export default class Canvas extends Component {
  render() {
    return (
      <section className="canvas">
        <div className="canvas__container">
          <Quadrant title="Backend"/>
          <Quadrant title="Private"/>
          <Quadrant title="Gateways"/>
          <Quadrant title="Public"/>
        </div>
      </section>
    );
  }
}
