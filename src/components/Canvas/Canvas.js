import React, {Component} from 'react';
import BackendQuadrant from '../Quadrant/BackendQuadrant';
import PrivateQuadrant from '../Quadrant/PrivateQuadrant';
import GatewaysQuadrant from '../Quadrant/GatewaysQuadrant';
import PublicQuadrant from '../Quadrant/PublicQuadrant';
import PrivateEndpoint from '../../stores/PrivateEndpoint';
import './Canvas.scss';

export default class Canvas extends Component {
  render() {
    /*
     TODO: data storage needs to be changed
     */
    
    return (
      <section className="canvas">
        <div className="canvas__container">
          <BackendQuadrant data={PrivateEndpoint} resizable title="Backend"/>
          <PrivateQuadrant data={PrivateEndpoint} resizable title="Private"/>
          <GatewaysQuadrant data={PrivateEndpoint} resizable title="Gateways"/>
          <PublicQuadrant data={PrivateEndpoint} title="Public"/>
        </div>
      </section>
    );
  }
}
