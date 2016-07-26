import React, {Component} from 'react';
import QuadrantContainer from '../Quadrant/QuadrantContainer';
import CanvasOverlay from './CanvasOverlay';
import './Canvas.scss';
import addConnection from 'actions/Connection/add';
import removeConnection from 'actions/Connection/remove';
import moveConnection from 'actions/Connection/move';
import Connection from 'stores/Connection';
import toggleHighlight from 'actions/CanvasElements/toggleHighlight';

export default class Canvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastUpdate: new Date(),
      canvasHeight: null,
      connections: []
    };

    this.connectionsChanged = () => {
      this.setState({connections: Connection.getData()});
    }
  }

  componentWillMount() {
    this.repaint = setInterval(() => {
      this.paper.repaintEverything();
    }, 50);

    Connection.addChangeListener(this.connectionsChanged);
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

    LunchBadgerCore.utils.paper = this.paper;

    this._attachPaperEvents();
    this._registerConnectionTypes();

    jsPlumb.fire('canvasLoaded', this.paper);
  }

  componentWillUnmount() {
    clearInterval(this.repaint);

    Connection.removeChangeListener(this.connectionsChanged);
  }

  _disconnect(connection) {
    this.paper.detach(connection, {
      fireEvent: false
    });

    removeConnection(connection.sourceId, connection.targetId);
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

    if ((source.parentElement.classList.contains('port-in') && target.parentElement.classList.contains('port-in')) ||
      (source.parentElement.classList.contains('port-out') && target.parentElement.classList.contains('port-out'))) {
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

  _rollbackConnection(connection, source, target) {
    if (connection.suspendedElementType === 'target') {
      this.paper.connect({
        source: source,
        target: connection.suspendedElement
      }, {
        fireEvent: false
      });
    } else if (connection.suspendedElementType === 'source') {
      this.paper.connect({
        source: connection.suspendedElement,
        target: target
      }, {
        fireEvent: false
      });
    }
  }

  _attachPaperEvents() {
    this.paper.bind('connection', (info) => {
      const {source, sourceId, target, targetId, connection} = info;

      if (!this._isConnectionValid(source, sourceId, target, targetId)) {
        this._disconnect(connection);

        return;
      }

      if (source.parentElement.classList.contains('port-in')) {
        this._flipConnection(connection);
        this._disconnect(connection);

        return;
      }

      if (Connection.findEntityIndexBySourceAndTarget(sourceId, targetId) < 0) {
        let strategyFulfilled = null;

        this.props.plugins.getConnectionCreatedStrategies().forEach((strategy) => {
          if (strategyFulfilled === null) {
            const fulfilledStatus = strategy.handleConnectionCreated.checkAndFulfill(info, this.paper);

            if (fulfilledStatus !== null) {
              strategyFulfilled = fulfilledStatus;
            }
          }
        });

        if (strategyFulfilled === false && connection.suspendedElement) {
          this._rollbackConnection(connection, source, target);
        } else if (strategyFulfilled === false) {
          this._disconnect(connection);
        }

        if (strategyFulfilled === null) {
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

    this.paper.bind('beforeDrag', () => {
      return true;
    });

    this.paper.bind('connectionAborted', () => {
      return true;
    });

    this.paper.bind('click', (connection, event) => {
      if (event.target.classList.contains('remove-button')) {
        this._disconnect(connection);
      }
    });
  }

  render() {
    let {canvasHeight} = this.state;

    if (!this.props.appState.getStateKey('currentlyOpenedPanel')) {
      canvasHeight = null;
    }

    const panelEditingStatus = this.props.appState.getStateKey('panelEditingStatus');

    return (
      <section className="canvas"
               onClick={() => !panelEditingStatus && this.props.appState.getStateKey('currentElement') && toggleHighlight(null)}>
        {panelEditingStatus && <CanvasOverlay appState={this.props.appState}/> }
        <div style={{height: canvasHeight}} className="canvas__wrapper">
          <div style={{height: canvasHeight}} className="canvas__legend">
            <div className="canvas__label canvas__label--left">Producers</div>
            <div className="canvas__label canvas__label--right">Consumers</div>
          </div>

          <QuadrantContainer appState={this.props.appState}
                             plugins={this.props.plugins}
                             paper={this.paper}
                             connections={this.state.connections}
                             style={{minHeight: canvasHeight}}
                             className="canvas__container" id="canvas"/>
        </div>
      </section>
    );
  }
}
