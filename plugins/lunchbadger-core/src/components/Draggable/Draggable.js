import React, {Component, PropTypes} from 'react';

export default class Draggable extends Component {
  static propTypes = {
    onDrag: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    children: PropTypes.object.isRequired
  };

  handleDragStart = (event) => {
    document.body.addEventListener('mousemove', this.handleDrag);
    document.body.addEventListener('mouseup', this.handleDragEnd);

    if (typeof this.props.onDragStart === 'function') {
      this.props.onDragStart(event);
    }
  }

  handleDragEnd = (event) => {
    document.body.removeEventListener('mousemove', this.handleDrag);
    document.body.removeEventListener('mouseup', this.handleDragEnd);

    if (typeof this.props.onDragEnd === 'function') {
      this.props.onDragEnd(event);
    }
  }

  handleDrag = (event) => {
    if (typeof this.props.onDrag === 'function') {
      this.props.onDrag(event);
    }
  }

  render() {
    return (
      <div onMouseDown={this.handleDragStart}>
        {this.props.children}
      </div>
    );
  }
}
