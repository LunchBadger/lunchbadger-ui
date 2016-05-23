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
    connectDragSource: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      moved: false
    }
  }

  render() {
    const {connectDragSource} = this.props;
    const elementClass = classNames({
      moved: this.state.moved
    });

    return connectDragSource((
      <div className={`base-plan__icon ${elementClass}`}>
        <i className={`fa ${this.props.entity.icon}`}/>
      </div>
    ))
  }
}
