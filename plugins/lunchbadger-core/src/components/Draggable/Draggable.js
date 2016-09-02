import React, {Component, PropTypes} from 'react';

export default class Draggable extends Component {
  static propTypes = {
    onDrag: PropTypes.func,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    children: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this._handleDrag = this.handleDrag.bind(this);
    this._handleDragEnd = this.handleDragEnd.bind(this);
  }

  handleDragStart(event) {
    document.body.addEventListener('mousemove', this._handleDrag);
    document.body.addEventListener('mouseup', this._handleDragEnd);

    if (typeof this.props.onDragStart === 'function') {
      this.props.onDragStart(event);
    }
  }

  handleDragEnd(event) {
    document.body.removeEventListener('mousemove', this._handleDrag);
    document.body.removeEventListener('mouseup', this._handleDragEnd);

    if (typeof this.props.onDragEnd === 'function') {
      this.props.onDragEnd(event);
    }
  }

  handleDrag(event) {
    if (typeof this.props.onDrag === 'function') {
      this.props.onDrag(event);
    }
  }

  render() {
    return (
      <div onMouseDown={this.handleDragStart.bind(this)}>
        {this.props.children}
      </div>
    );
  }
}
