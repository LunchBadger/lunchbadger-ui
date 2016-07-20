import React, {Component, PropTypes} from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import MetricHeader from './Subelements/MetricHeader';
import MetricRemoveButton from './Subelements/MetricRemoveButton';
import MetricDetails from './Subelements/MetricDetails';
import classNames from 'classnames';
import aggregate from 'actions/Metrics/aggregate';
import './Metric.scss';

const boxSource = {
  beginDrag(props) {
    const {metric} = props;

    return {metric, left: metric.left, top: metric.top};
  }
};

const boxTarget = {
  canDrop(props, monitor) {
    const item = monitor.getItem();

    if (!item.metric) {
      return false;
    }

    if (item.metric.id === props.metric.id) {
      return false;
    }

    if (props.metric.pairs.length > 1) {
      return false;
    }

    if (props.metric.pairs[0].metricTwo && !item.metric.pairs[0].metricTwo) {
      return false;
    }

    if (item.metric.pairs.length > 1) {
      return false;
    }

    return true;
  },

  drop(props, monitor) {
    const item = monitor.getItem();

    aggregate(props.metric, item.metric);
  }
};

@DragSource('metric', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))
@DropTarget('metric', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
export default class Metric extends Component {
  static propTypes = {
    metric: PropTypes.object.isRequired,
    isOver: PropTypes.bool,
    canDrop: PropTypes.bool,
    connectDragSource: PropTypes.func,
    connectDragPreview: PropTypes.func,
    connectDropTarget: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  renderHeader() {
    return (
      <div>
        {
          this.props.metric.pairs.map((pair, index) => {
            return (
              <div key={pair.id}>
                {index > 0 && <div className="metric__title__details__split">AND</div>}
                <MetricHeader pair={pair}/>
              </div>
            );
          })
        }
      </div>
    );
  }

  render() {
    const {metric, connectDragSource, connectDragPreview, connectDropTarget} = this.props;
    const {left, top} = metric;
    const metricStyle = {
      left,
      top
    };

    const metricClass = classNames({
      metric: true,
      'metric--is-over': this.props.isOver && this.props.canDrop
    });

    return connectDropTarget(connectDragPreview(
      <div className={metricClass} style={metricStyle}>
        {
          connectDragSource(
            <div className="metric__title">
              <div className="metric__title__icon">
                <i className="icon-icon-metrics"/>
              </div>
              <div className="metric__title__details">
                {this.renderHeader()}
              </div>
              <MetricRemoveButton metric={this.props.metric}/>
            </div>
          )
        }

        <div className="metric__details">
          <MetricDetails metric={metric}/>
        </div>
      </div>
    ));
  }
}
