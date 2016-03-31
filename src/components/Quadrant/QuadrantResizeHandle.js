import React, {Component} from 'react';
import Draggable from '../Draggable/Draggable';

export default class QuadrantResizeHandle extends Component {
  render() {
    return (
      <Draggable onDrag={(event) => console.log(event)} onDragEnd={(event) => console.log(event)}>
        <div className="quadrant__resize-handle"></div>
      </Draggable>
    );
  }
}
