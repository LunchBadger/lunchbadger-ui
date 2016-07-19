import React, {Component, PropTypes} from 'react';
import {DragSource} from 'react-dnd';
import './Metric.scss';

const boxSource = {
  beginDrag(props) {
    const {metric} = props;

    return {metric, entity: metric.entity, left: metric.left, top: metric.top};
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
    const {left, top, entity} = metric;
    const metricStyle = {
      left,
      top
    };

    return connectDragPreview(
      <div className="metric" style={metricStyle}>
        {connectDragSource(<div className="metric__title">
          <div className="metric__title__icon">
            <i className="icon-icon-metrics" />
          </div>
          <div className="metric__title__name">
            <span className="metric__entity-name">{entity.name}</span>
          </div>
        </div>)}

        <div className="metric__details">

        </div>
      </div>
    );
  }
}
