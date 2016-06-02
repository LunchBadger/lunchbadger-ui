import React, {Component, PropTypes} from 'react';
import './PlanIcon.scss';
import {DragSource} from 'react-dnd';
import classNames from 'classnames';

const boxSource = {
  beginDrag(props) {
    const {entity, left, top} = props;
    return {entity, left, top};
  }
};

@DragSource('planElement', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class PlanIcon extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    changed: PropTypes.bool
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {connectDragSource} = this.props;
    const elementClass = classNames({
      'base-plan__icon': true,
      'base-plan__icon--changed': this.props.changed
    });

    return connectDragSource((
      <div className={elementClass}>
        <i className={`fa ${this.props.entity.icon}`}/>
      </div>
    ))
  }
}
