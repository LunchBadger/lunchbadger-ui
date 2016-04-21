import React, {Component, PropTypes} from 'react';
import './CanvasElement.scss';
import {findDOMNode} from 'react-dom';
import classNames from 'classnames';
import addElement from 'actions/addElement';
import {DragSource, DropTarget} from 'react-dnd';

const boxSource = {
  beginDrag(props) {
    const {entity, itemOrder} = props;
    return {entity, itemOrder};
  }
};

const boxTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().itemOrder;
    const hoverIndex = props.itemOrder;
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveEntity(monitor.getItem().entity, dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().itemOrder = hoverIndex;
  }
}

@DragSource('canvasElement', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
@DropTarget('canvasElement', boxTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
export default (ComposedComponent) => {
  return class CanvasElement extends Component {
    static propTypes = {
      icon: PropTypes.string.isRequired,
      entity: PropTypes.object.isRequired,
      connectDragSource: PropTypes.func.isRequired,
      isDragging: PropTypes.bool.isRequired,
      itemOrder: PropTypes.number.isRequired,
      hideSourceOnDrag: PropTypes.bool.isRequired
    };

    constructor(props) {
      super(props);

      this.state = {
        name: props.entity.name,
        editable: true,
        expanded: true,
        mouseOver: false
      };
    }

    componentDidMount() {
      if (this.props.entity.ready) {
        this.triggerElementAutofocus();
      }

      setTimeout(() => addElement(this.element));
      this.props.entity.elementDOM = this.elementDOM;
    }

    componentDidUpdate() {
      this.props.entity.elementDOM = this.elementDOM;
    }

    update() {
      const element = this.element.decoratedComponentInstance || this.element;

      if (typeof element.update === 'function') {
        element.update();
      }

      this.setState({
        editable: false,
        expanded: false
      });
    }

    updateName(evt) {
      const element = this.element.decoratedComponentInstance || this.element;

      this.setState({name: evt.target.value});

      if (typeof element.updateName === 'function') {
        element.updateName(evt);
      }
    }

    triggerElementAutofocus() {
      const nameInput = findDOMNode(this.refs.nameInput);
      const selectAllOnce = () => {
        nameInput.select();
        nameInput.removeEventListener('focus', selectAllOnce);
      };

      nameInput.addEventListener('focus', selectAllOnce);
      nameInput.focus();
    }

    handleEnterPress(event) {
      const keyCode = event.which || event.keyCode;

      // ENTER
      if (keyCode === 13) {
        this.update();
      }
    }

    toggleExpandedState() {
      this.setState({expanded: !this.state.expanded}, () => {
        this.props.paper.repaintEverything();
      });
    }

    render() {
      const {ready} = this.props.entity;
      const elementClass = classNames({
        'canvas-element': true,
        editable: this.state.editable && ready,
        expanded: this.state.expanded && ready,
        collapsed: !this.state.expanded,
        wip: !ready,
        'mouse-over': this.state.mouseOver
      });
      const {connectDragSource, connectDropTarget, isDragging} = this.props;
      const opacity = isDragging ? 0.2 : 1;

      return connectDragSource(connectDropTarget(
        <div ref={(ref) => this.elementDOM = ref}
             className={`${elementClass} ${this.props.entity.constructor.type}`}
             style={{ opacity }}
             onMouseEnter={() => this.setState({mouseOver: true})}
             onMouseLeave={() => this.setState({mouseOver: false})}>
          <div className="canvas-element__inside">
            <div className="canvas-element__icon" onClick={this.toggleExpandedState.bind(this)}>
              <i className={`fa ${this.props.icon}`}/>
            </div>
            <div className="canvas-element__title">
              <span className="canvas-element__name hide-while-edit"
                    onDoubleClick={() => this.setState({editable: true})}>{this.props.entity.name}</span>
              <input className="canvas-element__input editable-only"
                     ref="nameInput"
                     value={this.state.name}
                     onKeyPress={this.handleEnterPress.bind(this)}
                     onChange={this.updateName.bind(this)}/>
            </div>
          </div>
          <div className="canvas-element__extra">
            <ComposedComponent parent={this} ref={(ref) => this.element = ref} {...this.props} {...this.state}/>
          </div>
          <div className="canvas-element__actions editable-only">
            <button className="canvas-element__button" onClick={() => this.update()}>OK</button>
          </div>
        </div>
      ));
    }
  }
}
