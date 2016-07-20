import React, {Component} from 'react';
import {DropTarget} from 'react-dnd';
import classNames from 'classnames';
import Metric from 'stores/Metric';
import create from 'actions/Metrics/create';
import update from 'actions/Metrics/update';
import MetricComponent from 'components/Metric/Metric';
import './MetricsPanel.scss';

export const METRICS_PANEL = 'METRICS_PANEL';

const boxTarget = {
  drop(props, monitor) {
    const item = monitor.getItem();
    const delta = monitor.getSourceClientOffset();

    if (!delta) {
      return;
    }

    if (item.metric && Metric.findEntity(item.metric.id)) {
      update(item.metric, delta.x - 60, delta.y - 60);
    } else if (item.entity && !Metric.findByEntityId(item.entity.id)) {
      create(item.entity, delta.x - 60, delta.y - 60);
    }
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
    const {connectDropTarget, isOver} = this.props;
    const panelClass = classNames({
      'panel__metrics-drop': true,
      'panel__metrics-drop--over': isOver
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

export default LunchBadgerCore.components.Panel(DropTarget(['canvasElement', 'metric'], boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({shallow: true})
}))(MetricsPanel));
