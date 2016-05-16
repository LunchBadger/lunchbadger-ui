import React, {Component, PropTypes} from 'react';
import './CreatureIcon.scss';
import {DragSource} from 'react-dnd';
import classNames from 'classnames';

const boxSource = {
  beginDrag(props) {
    const { entity, left, top } = props;
    return { entity, left, top };
  }
};

@DragSource('creatureElement', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class CreatureIcon extends Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    entity: PropTypes.object.isRequired,
    connectDragSource: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      moved: false
    }
  }

  render() {
    const {connectDragSource, isDragging} = this.props;
    const elementClass = classNames({
      moved: this.state.moved
    });

    return connectDragSource((
      <div className={`base-creature__icon ${elementClass}`}>
        <i className={`fa ${this.props.icon}`}></i>
      </div>
    ))
  }
}
