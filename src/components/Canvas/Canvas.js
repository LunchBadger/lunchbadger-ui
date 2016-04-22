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
import classNames from 'classnames';
import addConnection from '../../actions/Connection/add';
import removeConnection from '../../actions/Connection/remove';
import Connection from 'stores/Connection';
import toggleHighlight from 'actions/CanvasElements/toggleHighlight';

export default class Canvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastUpdate: new Date(),
      disabled: false
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
      Anchors: [0.5, 0, 0.5, 0.5]
    });

    this._attachPaperEvents();

    jsPlumb.fire('canvasLoaded', this.paper);
  }

  _handleExistingConnectionDetach(info) {
    const {connection} = info;
    const existingConnections = this.paper.select({source: connection.sourceId, target: connection.targetId});

    if (existingConnections.length > 1) {
      this.paper.detach(connection, {
        fireEvent: false
      });
    }
  }

  _attachPaperEvents() {
    this.paper.bind('connection', (info) => {
      this._handleExistingConnectionDetach(info);

      if (Connection.findEntityIndexBySourceAndTarget(info.sourceId, info.targetId) < 0) {
        addConnection(info.sourceId, info.targetId, info);
      }
    });

    this.paper.bind('connectionDetached', (info) => {
      this.paper.connect({
        source: info.source,
        target: info.target
      });
    });

    this.paper.bind('connectionMoved', (info) => {
      this.paper.connect({
        source: info.originalSourceEndpoint.element,
        target: info.originalTargetEndpoint.element
      });
    });

    this.paper.bind('beforeDrag', () => {
      this.paper.repaintEverything();

      return true;
    });

    this.paper.bind('connectionAborted', () => {
      setTimeout(() => {
        this.paper.repaintEverything();
      });

      return true;
    });
  }

  componentWillUnmount() {
    Private.removeChangeListener(this.dataUpdated);
    Public.removeChangeListener(this.dataUpdated);
    Gateway.removeChangeListener(this.dataUpdated);
    Backend.removeChangeListener(this.dataUpdated);
  }

  render() {
    const canvasClass = classNames({
      canvas: true,
      'canvas--disabled': this.state.disabled
    });

    return (
      <section className={canvasClass} onClick={() => toggleHighlight(null)}>
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
