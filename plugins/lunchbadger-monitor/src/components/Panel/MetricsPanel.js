import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {DropTarget} from 'react-dnd';
import classNames from 'classnames';
import Metric from '../../stores/Metric';
import create from '../../actions/Metrics/create';
import createBundle from '../../actions/Metrics/createBundle';
import update from '../../actions/Metrics/update';
import MetricComponent from '../Metric/Metric';
import './MetricsPanel.scss';

export const METRICS_PANEL = 'METRICS_PANEL';

const Panel = LunchBadgerCore.components.Panel;

const boxTarget = {
  drop(props, monitor) {
    const item = monitor.getItem();
    const delta = monitor.getSourceClientOffset();
    if (!delta) {
      return;
    }
    if (monitor.getItemType() === 'elementsGroup') {
      return createBundle(props.currentlySelectedSubelements, delta.x - 60, delta.y - 60);
    }
    if (item.metric && Metric.findEntity(item.metric.id)) {
      update(item.metric, delta.x - 60, delta.y - 60);
    } else if (item.entity && !Metric.findByEntityId(item.entity.id)) {
      create(item.entity, delta.x - 60, delta.y - 60);
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
    this.state = {
      entities: []
    };
    this.onStoreUpdate = () => {
      setTimeout(() => this.setState({entities: Metric.getData()}));
    }
  }

  componentWillMount() {
    Metric.addChangeListener(this.onStoreUpdate);
  }

  componentWillUnmount() {
    Metric.removeChangeListener(this.onStoreUpdate)
  }

  renderEntities() {
    return this.state.entities.map((entity) => {
      return <MetricComponent key={entity.id} metric={entity}/>;
    });
  }

  render() {
    const {connectDropTarget, isOver, canDrop} = this.props;
    const panelClass = classNames({
      'panel__metrics-drop': true,
      'panel__metrics-drop--over': isOver && canDrop
    });

    return connectDropTarget(
      <div className="panel__body">
        {
          this.state.entities.length === 0 && (
            <div className={panelClass}>
              <div className="panel__metrics-drop__inside">
                Drag objects here to measure them
              </div>
            </div>
          )
        }

        {this.state.entities.length > 0 && this.renderEntities()}
      </div>
    );
  }
}

const selector = createSelector(
  state => state.states.currentlySelectedSubelements,
  currentlySelectedSubelements => ({currentlySelectedSubelements}),
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
