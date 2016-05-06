import React, {Component} from 'react';
import QuadrantContainer from '../Quadrant/QuadrantContainer';
import Private from 'stores/Private';
import Backend from 'stores/Backend';
import './Canvas.scss';
import classNames from 'classnames';
import addConnection from 'actions/Connection/add';
import removeConnection from 'actions/Connection/remove';
import moveConnection from 'actions/Connection/move';
import reattachConnection from 'actions/Connection/reattach';
import attachConnection from 'actions/Connection/attach';
import Connection from 'stores/Connection';

const toggleHighlight = LunchBadgerCore.actions.toggleHighlight;

export default class Canvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastUpdate: new Date(),
      disabled: false
    };
  }

  componentDidMount() {
    this.paper = jsPlumb.getInstance({
      DragOptions: {cursor: 'pointer', zIndex: 2000},
      PaintStyle: {
        strokeStyle: '#ffffff',
        lineWidth: 6
      },
      Connector: ['Bezier', {curviness: 40}],
      Container: 'canvas',
      ConnectionOverlays: [
        ['Label',
          {
            label: 'X',
            id: 'remove-button',
            cssClass: 'remove-button'
          }
        ]
      ],
      Anchors: [0.5, 0, 0.5, 0.5]
    });

    this._attachPaperEvents();
    this._registerConnectionTypes();

    jsPlumb.fire('canvasLoaded', this.paper);
  }

  _disconnect(connection) {
    this.paper.detach(connection, {
      fireEvent: false
    });

    removeConnection(connection.sourceId, connection.targetId);
  }

  _handleExistingConnectionDetach(info) {
    const {connection} = info;
    const existingConnections = this.paper.select({source: connection.sourceId, target: connection.targetId});
    const existingReverseConnections = this.paper.select({source: connection.targetId, target: connection.sourceId});

    if ((existingConnections.length + existingReverseConnections.length) > 1) {
      this._disconnect(connection);
    }
  }

  _flipConnection(info) {
    this.paper.connect({
      source: info.target,
      target: info.source
    });
  }

  _isConnectionValid(source, sourceId, target, targetId) {
    if (sourceId === targetId) {
      return false;
    }

    if ((source.classList.contains('port-in') && target.classList.contains('port-in')) ||
      (source.classList.contains('port-out') && target.classList.contains('port-out'))) {
      return false;
    }

    return true;
  }

  _registerConnectionTypes() {
    this.paper.registerConnectionTypes({
      'wip': {
        cssClass: 'loading',
        detachable: false
      }
    });
  }

  _checkIfConnectionWasMadeBetweenModelAndDataSource(sourceId, targetId) {
    const isBackend = Backend.findEntity(sourceId);
    const isPrivate = Private.findEntity(targetId);

    return isBackend && isPrivate;
  }

  _attachPaperEvents() {
    this.paper.bind('connection', (info) => {
      const {source, sourceId, target, targetId, connection} = info;

      if (!this._isConnectionValid(source, sourceId, target, targetId)) {
        return this._disconnect(connection);
      }

      if (source.classList.contains('port-in')) {
        this._disconnect(connection);
        this._flipConnection(info);

        return;
      }

      this._handleExistingConnectionDetach(info);

      if (Connection.findEntityIndexBySourceAndTarget(sourceId, targetId) < 0) {
        if (this._checkIfConnectionWasMadeBetweenModelAndDataSource(sourceId, targetId)) {
          attachConnection(sourceId, targetId, info);
        } else {
          addConnection(sourceId, targetId, info);
        }
      }
    });

    this.paper.bind('connectionDetached', (info) => {
      this.paper.connect({
        source: info.source,
        target: info.target
      });
    });

    this.paper.bind('connectionMoved', (info) => {
      if (Connection.findEntityIndexBySourceAndTarget(info.newSourceId, info.newTargetId) > -1 || !this._isConnectionValid(info.newSourceEndpoint.element, info.newSourceId, info.newTargetEndpoint.element, info.newTargetId)) {
        setTimeout(() => {
          this.paper.connect({
            source: info.originalSourceEndpoint.element,
            target: info.originalTargetEndpoint.element
          });
        });

      } else {
        if (this._checkIfConnectionWasMadeBetweenModelAndDataSource(info.newSourceId, info.newTargetId)) {
          reattachConnection(info.originalSourceId, info.originalTargetId, info.newSourceId, info.newTargetId, info);
        } else {
          moveConnection(info.originalSourceId, info.originalTargetId, info.newSourceId, info.newTargetId, info);
        }
      }
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

    this.paper.bind('click', (connection, event) => {
      if (event.target.classList.contains('remove-button')) {
        this._disconnect(connection);
      }
    });
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

          <QuadrantContainer paper={this.paper} className="canvas__container" id="canvas" />
        </div>
      </section>
    );
  }
}
