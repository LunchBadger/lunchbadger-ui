import React, {Component, PropTypes} from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import MetricHeader from './Subelements/MetricHeader';
import MetricRemoveButton from './Subelements/MetricRemoveButton';
import MetricDetails from './Subelements/MetricDetails';
import MetricTypeTooltip from './Subelements/MetricTypeTooltip';
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

    this.state = {
      currentPairId: null
    };
  }

  _handleMetricSelection(pair) {
    this.setState({currentPairId: pair ? pair.id : null});
  }

  _handleMetricTypeChange() {
    this.setState({currentPairId: null});
  }

  renderHeader() {
    return (
      <div>
        {
          this.props.metric.pairs.map((pair, index) => {
            return (
              <div key={pair.id}>
                {index > 0 && <div className="metric__title__details__split">AND</div>}
                <MetricHeader selectedPair={this.state.currentPairId}
                              pair={pair}
                              metricSelection={this._handleMetricSelection.bind(this)}/>
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

    const tooltipClass = classNames({
      metric__details__tooltip: true,
      'metric__details__tooltip--visible': this.state.currentPairId
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
          <div className={tooltipClass} onMouseLeave={() => this.setState({currentPairId: null})}>
            <MetricTypeTooltip pairId={this.state.currentPairId}
                               metric={metric}
                               onChange={this._handleMetricTypeChange.bind(this)}/>
          </div>
          <MetricDetails metric={metric}/>
        </div>
      </div>
    ));
  }
}
