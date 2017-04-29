import React, {Component, PropTypes} from 'react';
import './CanvasElement.scss';
import {findDOMNode} from 'react-dom';
import classNames from 'classnames';
import {DragSource, DropTarget} from 'react-dnd';
import toggleHighlight from '../../actions/CanvasElements/toggleHighlight';
import toggleEdit from '../../actions/CanvasElements/toggleEdit';
import _ from 'lodash';
import {Form} from 'formsy-react';
import Input from '../Generics/Form/Input';
import TwoOptionModal from '../Generics/Modal/TwoOptionModal';
import removeEntity from '../../actions/CanvasElements/removeEntity';
import {IconSVG, Entity, EntityActionButtons, EntityValidationErrors} from '../../../../lunchbadger-ui/src';
import iconTrash from '../../../../../src/icons/icon-trash.svg';
import iconEdit from '../../../../../src/icons/icon-edit.svg';

const boxSource = {
  beginDrag(props) {
    const {entity, itemOrder} = props;
    return {entity, itemOrder};
  },

  canDrag(props) {
    return !props.appState.getStateKey('currentEditElement');
  }
};

const boxTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().itemOrder;
    const hoverIndex = props.itemOrder;

    if (dragIndex === hoverIndex) {
      return;
    }

    if (props.appState.getStateKey('isPanelOpened')) {
      return;
    }

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    // const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    // const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    if (dragIndex < hoverIndex && clientOffset.y < hoverBoundingRect.bottom - 15) {
      return;
    }

    if (dragIndex > hoverIndex && clientOffset.y > hoverBoundingRect.top + 15) {
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

    if (props.appState.getStateKey('isPanelOpened')) {
      return;
    }

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
        highlighted: false,
        showRemovingModal: false,
        validations: {
          isValid: true,
          data: {}
        },
        modelBeforeEdit: {},
      };

      this.checkHighlightAndEditableState = (props) => {
        const currentElement = props.appState.getStateKey('currentElement');
        this.currentOpenedPanel = props.appState.getStateKey('currentlyOpenedPanel');
        if (currentElement && currentElement.id === this.props.entity.id) {
          if (!this.state.highlighted) {
            this.setState({highlighted: true});
          }
        } else {
          this.setState({highlighted: false});
        }
      };
    }

    componentWillReceiveProps(props) {
      this._handleOnOver(props);
      this._handleDrop(props);
      this.checkHighlightAndEditableState(props);
    }

    componentDidMount() {
      if (this.props.entity.wasBundled) {
        this.setState({
          editable: false,
          expanded: false,
          validations: {isValid: true, data:{}}
        });
        return;
      }
      if (this.props.entity.loaded) {
        this.setState({
          editable: false,
          expanded: false,
          validations: {isValid: true, data:{}},
          modelBeforeEdit: this.entityRef.getFormRef().getModel()
        });
      } else if (this.props.entity.ready) {
        this.triggerElementAutofocus();
        toggleEdit(this.props.entity);
      }
      this.checkHighlightAndEditableState(this.props);
      this.props.entity.elementDOM = this.elementDOM;
    }

    componentDidUpdate() {
      this.props.entity.elementDOM = this.elementDOM;
    }

    update = (model) => {
      const element = this.element.decoratedComponentInstance || this.element;
      let updated;
      if (typeof element.update === 'function') {
        updated = element.update(model);
        this.setState({modelBeforeEdit: model});
      }
      if (typeof updated === 'undefined' || updated) {
        if (updated) {
          this.setState({validations: updated});
          if (!updated.isValid) {
            return;
          }
        }
        this.setState({editable: false, validations: {isValid: true, data:{}}});
        toggleEdit(null);
      }
    }

    updateName = (evt) => {
      const element = this.element.decoratedComponentInstance || this.element;
      if (typeof element.updateName === 'function') {
        element.updateName(evt);
      }
    }

    triggerElementAutofocus() {
      if (!this.entityRef) return; // FIXME
      const nameInput = findDOMNode(this.entityRef.getInputNameRef());
      const selectAllOnce = () => {
        nameInput.select();
        nameInput.removeEventListener('focus', selectAllOnce);
      };
      nameInput.addEventListener('focus', selectAllOnce);
      nameInput.focus();
    }

    toggleExpandedState = (evt) => {
      evt.persist();
      this.setState({expanded: !this.state.expanded}, () => {
        if (this.state.editable && !this.state.expanded) {
          toggleEdit(null);
          this.setState({editable: false, validations: {isValid: true, data:{}}}, () => {
            this.toggleHighlighted();
          });
        }
      });
    }

    toggleEditableState(event) {
      const {target} = event;
      if (this.state.editable) {
        return;
      }
      toggleEdit(this.props.entity);
      this.setState({editable: true}, () => {
        this.toggleHighlighted();
        this._focusClosestInput(target);
      });
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
      const closestProperty = target.closest('.EntityProperty__field');
      const closestPropertyInput = closestProperty && closestProperty.querySelector('input');
      const closestElement = target.closest('.Entity');
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

    _handleDrop(props) {
      if (this.props.isDragging && !props.isDragging && props.saveOrder) {
        props.saveOrder();
      }
    }

    _handleRemove = () => {
      if (this.element.removeEntity) {
        this.element.removeEntity();
      } else {
        removeEntity(this.props.entity);
      }
      toggleEdit(null);
    }

    _handleEdit = (evt) => {
      this.toggleEditableState(evt);
      this.setState({expanded: true});
      evt.stopPropagation();
    }

    _handleCancel = (evt) => {
      evt.persist();
      if (this.entityRef.getFormRef()) {
        this.entityRef.getFormRef().reset(this.state.modelBeforeEdit);
      }
      toggleEdit(null);
      this.setState({editable: false, validations: {isValid: true, data:{}}}, () => {
        this.toggleHighlighted();
      });
      evt.preventDefault();
      evt.stopPropagation();
    }

    _handleFieldUpdate = (field, value) => {
      const data = Object.assign({}, this.state.validations.data);
      if (data[field] && value !== '') {
        delete data[field];
      }
      const isValid = Object.keys(data).length === 0;
      this.setState({validations: {isValid, data}});
    }

    _handleValidationFieldClick = field => ({target}) => {
      const closestCanvasElement = target.closest('.Entity');
      const closestInput = closestCanvasElement && closestCanvasElement.querySelector(`#${field}`);
      if (closestInput) {
        closestInput.focus();
      }
    }

    render() {
      const {ready} = this.props.entity;
      const {connectDragSource, connectDropTarget, isDragging, icon} = this.props;
      const {validations} = this.state;
      const elementClass = classNames({
        'canvas-element': true,
        editable: this.state.editable && ready,
        expanded: this.state.expanded && ready,
        collapsed: !this.state.expanded,
        highlighted: this.state.highlighted || this.state.editable,
        dragging: isDragging,
        wip: !ready,
        invalid: !validations.isValid
      });
      const opacity = isDragging ? 0.2 : 1;
      const toolboxConfig = [
        {
          action: 'delete',
          svg: iconTrash,
          onClick: () => this.setState({showRemovingModal: true}),
        },
        {
          action: 'edit',
          svg: iconEdit,
          onClick: this._handleEdit,
        },
      ];
      return (
            <Entity
              ref={(r) => {this.entityRef = r}}
              type={this.props.entity.constructor.type}
              editable={this.state.editable && ready}
              expanded={this.state.expanded && ready}
              collapsed={!this.state.expanded}
              highlighted={this.state.highlighted || this.state.editable}
              dragging={isDragging}
              wip={!ready}
              invalid={validations.isValid}
              toolboxConfig={toolboxConfig}
              onToggleExpand={this.toggleExpandedState}
              name={this.props.entity.name}
              onNameChange={this.updateName}
              onCancel={this._handleCancel}
              validations={validations}
              onFieldClick={this._handleValidationFieldClick}
              onValidSubmit={this.update}
              onClick={(evt) => {this.toggleHighlighted(); evt.stopPropagation()}}
              onDoubleClick={this._handleEdit}
              connectDragSource={connectDragSource}
              connectDropTarget={connectDropTarget}
            >
              <ComposedComponent
                ref={(ref) => this.element = ref}
                parent={this}
                {...this.props}
                {...this.state}
                onFieldUpdate={this._handleFieldUpdate}
              />
              {this.state.showRemovingModal && (
                <TwoOptionModal
                  onClose={() => this.setState({showRemovingModal: false})}
                  onSave={this._handleRemove}
                  onCancel={() => this.setState({showRemovingModal: false})}
                  title="Remove entity"
                  confirmText="Remove"
                  discardText="Cancel"
                >
                  <span>
                    Do you really want to remove that entity?
                  </span>
                </TwoOptionModal>
              )}
            </Entity>
      );
    }
  }
}
