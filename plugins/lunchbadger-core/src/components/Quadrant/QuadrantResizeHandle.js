import React, {Component, PropTypes} from 'react';
import Draggable from '../Draggable/Draggable';

export default class QuadrantResizeHandle extends Component {
  static propTypes = {
    onDrag: PropTypes.func.isRequired,
    onDragEnd: PropTypes.func
  };

  render() {
    return (
      <Draggable onDrag={this.props.onDrag} onDragEnd={this.props.onDragEnd}>
        <div className="quadrant__resize-handle"></div>
      </Draggable>
    );
  }
}
