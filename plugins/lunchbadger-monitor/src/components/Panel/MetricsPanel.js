import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {DropTarget} from 'react-dnd';
import classNames from 'classnames';
import {create, createBundle, update, simulateWebTraffic} from '../../reduxActions/metrics';
import findMetricByEntityId from '../../utils/findMetricByEntityId';
import MetricComponent from '../Metric/Metric';
import './MetricsPanel.scss';

export const METRICS_PANEL = 'METRICS_PANEL';

const Panel = LunchBadgerCore.components.Panel;

const boxTarget = {
  drop(props, monitor) {
    const {dispatch, metrics} = props;
    const item = monitor.getItem();
    const delta = monitor.getSourceClientOffset();
    if (!delta) {
      return;
    }
    if (monitor.getItemType() === 'elementsGroup') {
      return dispatch(createBundle(props.currentlySelectedSubelements, delta.x - 60, delta.y - 60));
    }
    if (item.metric && metrics[item.metric.id]) {
      dispatch(update(item.metric, delta.x - 60, delta.y - 60));
    } else if (item.entity && !findMetricByEntityId(metrics, item.entity.id)) {
      dispatch(create(item.entity, delta.x - 60, delta.y - 60));
    }
  },

  canDrop(props, monitor) {
    const {currentlySelectedSubelements} = props;
    if (monitor.getItemType() === 'elementsGroup') {
      if (currentlySelectedSubelements.length === 3 || currentlySelectedSubelements.length > 4) {
        return false;
      }
    }
    return true;
  }
};

class MetricsPanel extends Component {
  constructor(props) {
    super(props);
    props.parent.storageKey = METRICS_PANEL;
  }

  componentDidMount() {
    this.webTrafficInterval = setInterval(this.handleWebTrafficInterval, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.webTrafficInterval);
  }

  handleWebTrafficInterval = () => {
    const {dispatch, metrics} = this.props;
    if (Object.keys(metrics).length > 0) {
      dispatch(simulateWebTraffic());
    }
  }

  render() {
    const {connectDropTarget, isOver, canDrop, metrics} = this.props;
    const panelClass = classNames({
      'panel__metrics-drop': true,
      'panel__metrics-drop--over': isOver && canDrop
    });
    const entities = Object.keys(metrics).map(key => metrics[key]);
    return connectDropTarget(
      <div className="panel__body metrics">
        {entities.length === 0 && (
          <div className={panelClass}>
            <div className="panel__metrics-drop__inside">
              Drag objects here to measure them
            </div>
          </div>
        )}
        {entities.length > 0 && entities.map(item => (
          <MetricComponent key={item.id} metric={item} />
        ))}
      </div>
    );
  }
}

const selector = createSelector(
  state => state.states.currentlySelectedSubelements,
  state => state.entities.metrics,
  (currentlySelectedSubelements, metrics) =>
    ({currentlySelectedSubelements, metrics}),
);

export default connect(selector)(Panel(
  DropTarget(
    ['canvasElement', 'metric', 'elementsGroup'],
    boxTarget,
    (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      isOverCurrent: monitor.isOver({shallow: true}),
    }),
  )(MetricsPanel),
));
