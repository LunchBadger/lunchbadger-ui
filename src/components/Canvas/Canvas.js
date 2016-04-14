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
  constructor(props) {
    super(props);

    this.state = {
      lastUpdate: new Date()
    };

    this.dataUpdated = () => {
      this.setState({lastUpdate: new Date()}, () => {
        console.log(this.state.lastUpdate);
      });
    }
  }

  componentDidMount() {
    Private.addChangeListener(this.dataUpdated);
    Public.addChangeListener(this.dataUpdated);
    Gateway.addChangeListener(this.dataUpdated);
    Backend.addChangeListener(this.dataUpdated);

    this.paper = jsPlumb.getInstance({
      DragOptions: {cursor: 'pointer', zIndex: 2000},
      PaintStyle: {
        strokeStyle: '#ffffff',
        lineWidth: 6
      },
      Connector: ['Bezier', {curviness: 40}],
      Container: 'canvas',
      Anchor: [0.5, 0, 0.5, 0.5]
    });

    this.paper.bind('connection', function (i) {
      console.log('connection', i.connection);
    });

    jsPlumb.fire('canvasLoaded', this.paper);
  }

  componentWillUnmount() {
    Private.removeChangeListener(this.dataUpdated);
    Public.removeChangeListener(this.dataUpdated);
    Gateway.removeChangeListener(this.dataUpdated);
    Backend.removeChangeListener(this.dataUpdated);
  }

  render() {
    return (
      <section className="canvas">
        <div className="canvas__wrapper">
          <div className="canvas__legend">
            <div className="canvas__label canvas__label--left">Producers</div>
            <div className="canvas__label canvas__label--right">Consumers</div>
          </div>

          <div className="canvas__container" id="canvas">
            <BackendQuadrant paper={this.paper} ref="backendQuadrant" data={Backend} resizable title="Backend"/>
            <PrivateQuadrant paper={this.paper} ref="privateQuadrant" data={Private} resizable title="Private"/>
            <GatewaysQuadrant paper={this.paper} ref="gatewaysQuadrant" data={Gateway} resizable title="Gateways"/>
            <PublicQuadrant paper={this.paper} ref="publicQuadrant" data={Public} title="Public"/>
          </div>
        </div>
      </section>
    );
  }
}
