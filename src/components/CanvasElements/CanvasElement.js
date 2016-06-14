import React, {Component, PropTypes} from 'react';
import './CanvasElement.scss';
import {findDOMNode} from 'react-dom';
import classNames from 'classnames';
import {DragSource, DropTarget} from 'react-dnd';
import toggleHighlight from 'actions/CanvasElements/toggleHighlight';
import panelKeys from 'constants/panelKeys';
import _ from 'lodash';
import {Form} from 'formsy-react';
import Input from 'components/Generics/Form/Input';

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

    if (dragIndex === hoverIndex) {
      return;
    }

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    const item = monitor.getItem();

    if (item.subelement) {
      return;
    }

    props.moveEntity(item.entity, dragIndex || 0, hoverIndex || 0);
    monitor.getItem().itemOrder = hoverIndex;
  },

  canDrop(props, monitor) {
    const item = monitor.getItem();

    return _.includes(props.entity.accept, item.entity.constructor.type);
  },

  drop(props, monitor, component) {
    const item = monitor.getItem();
    const element = component.element.decoratedComponentInstance || component.element;

    if (typeof element.onDrop === 'function') {
      setTimeout(() => element.onDrop(item));
    }
  }
};

@DragSource('canvasElement', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
@DropTarget('canvasElement', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
export default (ComposedComponent) => {
  return class CanvasElement extends Component {
    static propTypes = {
      icon: PropTypes.string.isRequired,
      entity: PropTypes.object.isRequired,
      connectDragSource: PropTypes.func.isRequired,
      isDragging: PropTypes.bool.isRequired,
      itemOrder: PropTypes.number.isRequired,
      hideSourceOnDrag: PropTypes.bool.isRequired,
      isOver: PropTypes.bool,
      canDrop: PropTypes.bool
    };

    constructor(props) {
      super(props);

      this.currentOpenedPanel = null;

      this.state = {
        editable: true,
        expanded: true,
        highlighted: false
      };

      this.checkHighlightAndEditableState = (props) => {
        const currentElement = props.appState.getStateKey('currentElement');
        this.currentOpenedPanel = props.appState.getStateKey('currentlyOpenedPanel');

        if (currentElement && currentElement.id === this.props.entity.id) {
          this.setState({highlighted: true});
          if (this.currentOpenedPanel === panelKeys.DETAILS_PANEL) {
            this.setState({editable: false});
          }
        } else {
          this.setState({highlighted: false});
        }
      };
    }

    componentWillReceiveProps(props) {
      this._handleOnOver(props);

      this.checkHighlightAndEditableState(props);
    }

    componentDidMount() {
      if (this.props.entity.loaded) {
        this.setState({editable: false, expanded: false});
      } else if (this.props.entity.ready) {
        this.triggerElementAutofocus();
      }

      this.checkHighlightAndEditableState(this.props);

      this.props.entity.elementDOM = this.elementDOM;
    }

    componentDidUpdate() {
      this.props.entity.elementDOM = this.elementDOM;
    }

    update(model) {
      const element = this.element.decoratedComponentInstance || this.element;
      let updated;

      if (typeof element.update === 'function') {
        updated = element.update(model);
      }

      if (typeof updated === 'undefined' || updated) {
        this.setState({
          editable: false,
          expanded: false
        });
      }
    }

    updateName(evt) {
      const element = this.element.decoratedComponentInstance || this.element;

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

    toggleExpandedState() {
      this.setState({expanded: !this.state.expanded}, () => {
        this.props.paper.repaintEverything();
      });
    }

    toggleEditableState(event) {
      const {target} = event;

      if (this.state.editable) {
        return;
      }

      if (this.currentOpenedPanel !== panelKeys.DETAILS_PANEL) {
        this.setState({editable: true}, () => {
          this._focusClosestInput(target);
        });
      }
    }

    toggleHighlighted() {
      if (!this.state.highlighted) {
        toggleHighlight(this.props.entity);
      } else {
        setTimeout(() => {
          if (!this.state.editable && !this.state.expanded) {
            toggleHighlight(null);
          }
        });
      }
    }

    _focusClosestInput(target) {
      const closestProperty = target.closest('.canvas-element__properties__property');
      const closestPropertyInput = closestProperty && closestProperty.querySelector('input');
      const closestElement = target.closest('.canvas-element');
      const closestInput = closestElement.querySelector('input');

      if (closestPropertyInput) {
        closestPropertyInput.select();
      } else if (closestInput) {
        closestInput.select();
      }
    }

    _handleOnOver(props) {
      if (!this.props.canDrop) {
        return;
      }

      if (!this.props.isOver && props.isOver) {
        this.setState({highlighted: true});
      }

      if (this.props.isOver && !props.isOver) {
        this.setState({highlighted: false});
      }
    }

    render() {
      const {ready} = this.props.entity;
      const elementClass = classNames({
        'canvas-element': true,
        editable: this.state.editable && ready,
        expanded: this.state.expanded && ready,
        collapsed: !this.state.expanded,
        highlighted: this.state.highlighted,
        wip: !ready
      });
      const {connectDragSource, connectDropTarget, isDragging} = this.props;
      const opacity = isDragging ? 0.2 : 1;

      return connectDragSource(connectDropTarget(
        <div ref={(ref) => this.elementDOM = ref}
             className={`${elementClass} ${this.props.entity.constructor.type}`}
             style={{ opacity }}
             onClick={(evt) => {this.toggleHighlighted(); evt.stopPropagation()}}
             onDoubleClick={this.toggleEditableState.bind(this)}>
          <Form name="elementForm" ref="form" onValidSubmit={this.update.bind(this)}>
            <div className="canvas-element__inside">
              <div className="canvas-element__icon" onClick={this.toggleExpandedState.bind(this)}>
                <i className={`fa ${this.props.icon}`}/>
              </div>
              <div className="canvas-element__title">
                <span className="canvas-element__name hide-while-edit">{this.props.entity.name}</span>
                <Input className="canvas-element__input editable-only"
                       ref="nameInput"
                       name="name"
                       value={this.props.entity.name}
                       handleChange={this.updateName.bind(this)}/>
              </div>
            </div>
            <div className="canvas-element__extra">
              <div className="canvas-element__remove">
                <a className="canvas-element__remove__action">
                  <i className="fa fa-trash"/>
                </a>
              </div>

              <ComposedComponent parent={this} ref={(ref) => this.element = ref} {...this.props} {...this.state}/>
            </div>
            <div className="canvas-element__actions editable-only">
              <button type="submit" className="canvas-element__button">OK</button>
            </div>
          </Form>
        </div>
      ));
    }
  }
}
