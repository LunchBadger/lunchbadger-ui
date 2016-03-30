import React, {Component} from 'react';
import BackendQuadrant from '../Quadrant/BackendQuadrant';
import PrivateQuadrant from '../Quadrant/PrivateQuadrant';
import GatewaysQuadrant from '../Quadrant/GatewaysQuadrant';
import PublicQuadrant from '../Quadrant/PublicQuadrant';
import Private from '../../stores/Private';
import Public from '../../stores/Public';
import Gateway from '../../stores/Gateway';
import Backend from '../../stores/Backend';
import './Canvas.scss';

export default class Canvas extends Component {
  render() {
    /*
     TODO: data storage needs to be changed
     */
    
    return (
      <section className="canvas">
        <div className="canvas__container">
          <BackendQuadrant data={Backend} resizable title="Backend"/>
          <PrivateQuadrant data={Private} resizable title="Private"/>
          <GatewaysQuadrant data={Gateway} resizable title="Gateways"/>
          <PublicQuadrant data={Public} title="Public"/>
        </div>
      </section>
    );
  }
}
