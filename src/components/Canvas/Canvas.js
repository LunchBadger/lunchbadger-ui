import React, {Component} from 'react';
import Quadrant from './../Quadrant/Quadrant';
import PrivateEndpoint from '../../stores/PrivateEndpoint';
import './Canvas.scss';

export default class Canvas extends Component {
  render() {
    return (
      <section className="canvas">
        <div className="canvas__container">
          <Quadrant data={PrivateEndpoint} resizable title="Backend"/>
          <Quadrant resizable title="Private"/>
          <Quadrant resizable title="Gateways"/>
          <Quadrant title="Public"/>
        </div>
      </section>
    );
  }
}
