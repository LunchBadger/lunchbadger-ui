import React, {Component, PropTypes} from 'react';
import {DragSource} from 'react-dnd';
import MetricRemoveButton from './Subelements/MetricRemoveButton';
// import MetricDetails from './Subelements/MetricDetails';
import MetricType from './Subelements/MetricType';
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

  render() {
    const {metric, connectDragSource, connectDragPreview} = this.props;
    const {left, top} = metric;
    const metricStyle = {
      left,
      top
    };

    return connectDragPreview(
      <div className="metric" style={metricStyle}>
        {connectDragSource(<div className="metric__title">
          <div className="metric__title__icon">
            <i className="icon-icon-metrics"/>
          </div>
          <div className="metric__title__name">
            <span className="metric__entity-name">Private Endpoint 1</span>
          </div>
          <div className="metric__title__type">
            <MetricType metric={metric}/>
          </div>
          <div className="metric__title__name">
            <span className="metric__entity-name">Gateway 1</span>
          </div>
          <MetricRemoveButton metric={metric}/>
        </div>)}

        <div className="metric__details">
          {/*<MetricDetails metric={metric}/>*/}
        </div>
      </div>
    );
  }
}
