import React, {Component, PropTypes} from 'react';
import {DragSource} from 'react-dnd';
import MetricHeader from './Subelements/MetricHeader';
import MetricRemoveButton from './Subelements/MetricRemoveButton';
import MetricDetails from './Subelements/MetricDetails';
import './Metric.scss';

const boxSource = {
  beginDrag(props) {
    const {metric} = props;

    return {metric, left: metric.left, top: metric.top};
  }
};

@DragSource('metric', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))
export default class Metric extends Component {
  static propTypes = {
    metric: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  renderHeader() {
    return this.props.metric.pairs.map((pair) => {
      return (
        <MetricHeader key={pair.id} pair={pair}/>
      );
    });
  }

  render() {
    const {metric, connectDragSource, connectDragPreview} = this.props;
    const {left, top} = metric;
    const metricStyle = {
      left,
      top
    };

    return connectDragPreview(
      <div className="metric" style={metricStyle}>
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
    );
  }
}
