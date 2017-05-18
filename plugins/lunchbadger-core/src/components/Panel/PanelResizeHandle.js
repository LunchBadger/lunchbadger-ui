import React, {Component, PropTypes} from 'react';
import Draggable from '../Draggable/Draggable';
import classNames from 'classnames';

export default class PanelResizeHandle extends Component {
  static propTypes = {
    resizable: PropTypes.bool.isRequired,
    onDrag: PropTypes.func.isRequired,
    onDragEnd: PropTypes.func
  };

  _handleDrag = (event) => {
    if (this.props.resizable) {
      this.props.onDrag(event);
    }
  }

  _handleDragEnd = (event) => {
    if (this.props.resizable && typeof this.props.onDragEnd === 'function') {
      this.props.onDragEnd(event);
    }
  }

  render() {
    const resizableClass = classNames({
      'panel__handle': true,
      'panel__handle--resizable': this.props.resizable
    });

    return (
      <Draggable onDrag={this._handleDrag} onDragEnd={this._handleDragEnd}>
        <div className={resizableClass}></div>
      </Draggable>
    );
  }
}
