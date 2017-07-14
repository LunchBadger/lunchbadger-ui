import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './CanvasElement.scss';
import {findDOMNode} from 'react-dom';
import classNames from 'classnames';
import {DragSource, DropTarget} from 'react-dnd';
import toggleHighlight from '../../actions/CanvasElements/toggleHighlight';
import toggleEdit from '../../actions/CanvasElements/toggleEdit';
import _ from 'lodash';
import TwoOptionModal from '../Generics/Modal/TwoOptionModal';
import removeEntity from '../../actions/CanvasElements/removeEntity';
import {IconSVG, Entity, EntityActionButtons, EntityValidationErrors} from '../../../../lunchbadger-ui/src';
import {iconTrash, iconEdit, iconRevert} from '../../../../../src/icons';

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

    if (props.appState.getStateKey('isPanelOpened')) { // FIXME
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

    static contextTypes = {
      multiEnvIndex: PropTypes.number,
      multiEnvDelta: PropTypes.bool,
      multiEnvAmount: PropTypes.number,
    };

    constructor(props) {
      super(props);
      this.state = {
        editable: true,
        expanded: true,
        highlighted: false,
        showRemovingModal: false,
        validations: {
          isValid: true,
          data: {}
        },
        modelBeforeEdit: null,
        modelEnv_0: null,
      };
      this.multiEnvIndex = 0;
      this.checkHighlightAndEditableState = (props) => {
        const currentElement = props.appState.getStateKey('currentElement');
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
          // expanded: false,
          validations: {isValid: true, data:{}},
          modelBeforeEdit: this.entityRef.getFormRef().getModel(),
          modelEnv_0: this.entityRef.getFormRef().getModel(),
        });
      } else if (this.props.entity.ready) {
        this.triggerElementAutofocus();
        toggleEdit(this.props.entity);
      }
      this.checkHighlightAndEditableState(this.props);
      this.props.entity.elementDOM = this.elementDOM;
    }

    componentDidUpdate() {
      const element = this.element.decoratedComponentInstance || this.element;
      if (typeof element.getEntityDiffProps === 'function') {
        const modelBeforeEdit = element.getEntityDiffProps(this.state.modelBeforeEdit);
        if (modelBeforeEdit !== null) {
          this.setState({
            modelBeforeEdit,
            modelEnv_0: modelBeforeEdit,
          });
        }
      }
      this.props.entity.elementDOM = this.elementDOM;
      const {multiEnvIndex} = this.context;
      if (this.multiEnvIndex !== multiEnvIndex) {
        LunchBadgerCore.multiEnvIndex = multiEnvIndex;
        this.multiEnvIndex = multiEnvIndex;
        const newState = {...this.state};
        if (!this.state[`modelEnv_${multiEnvIndex}`]) {
          newState[`modelEnv_${multiEnvIndex}`] = _.cloneDeep(this.state.modelEnv_0);
        }
        this.setState(newState, () => {
          this.entityRef.getFormRef().reset(this.state[`modelEnv_${multiEnvIndex}`]);
          this.forceUpdate();
        });
      }
    }

    update = (model) => {
      const {multiEnvIndex, multiEnvAmount} = this.context;
      if (multiEnvIndex === 0 && this.state.modelEnv_0) {
        const newState = {};
        let isChange = false;
        Object.keys(model).forEach((key) => {
          if (this.state.modelEnv_0[key] !== model[key]) {
            isChange = true;
            for (let i = 1; i < multiEnvAmount; i += 1) {
              if (!newState[`modelEnv_${i}`]) {
                newState[`modelEnv_${i}`] = {...this.state[`modelEnv_${i}`]};
              }
              newState[`modelEnv_${i}`][key] = model[key];
            }
          }
        });
        if (isChange) {
          this.setState(newState);
        }
      }
      const element = this.element.decoratedComponentInstance || this.element;
      let updated;
      if (typeof element.update === 'function') {
        updated = element.update(model);
        this.setState({
          modelBeforeEdit: model,
          [`modelEnv_${multiEnvIndex}`]: model,
        });
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
      const {multiEnvIndex, multiEnvDelta} = this.context;
      if (multiEnvDelta && multiEnvIndex > 0) {
        evt.stopPropagation();
        return;
      }
      this.toggleEditableState(evt);
      this.setState({expanded: true});
      evt.stopPropagation();
    }

    _handleCancel = (evt) => {
      evt.persist();
      if (this.state.modelBeforeEdit === null) {
        this._handleRemove();
        evt.preventDefault();
        evt.stopPropagation();
        return;
      }
      if (this.entityRef.getFormRef()) {
        this.entityRef.getFormRef().reset(this.state.modelBeforeEdit);
      }
      const element = this.element.decoratedComponentInstance || this.element;
      if (typeof element.discardChanges === 'function') {
        element.discardChanges();
      }
      toggleEdit(null);
      this.setState({editable: false, validations: {isValid: true, data:{}}}, () => {
        this.toggleHighlighted();
      });
      if (this.element && this.element.discardChanges) {
        this.element.discardChanges();
      }
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

    resetEnvEntity = () => {
      this.update(this.state.modelEnv_0);
    }

    _handleResetField = name => () => {
      const {multiEnvIndex} = this.context;
      const model = {
        ...this.state[`modelEnv_${multiEnvIndex}`],
        [name]: this.state.modelEnv_0[name],
      };
      this.update(model);
    }

    propertiesMapping = key => ['_pipelines'].includes(key) ? key.replace(/_/, '') : key;

    render() {
      const {multiEnvIndex, multiEnvDelta} = this.context;
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
      const entityDevelopment = {...this.state.modelEnv_0};
      const entity = this.props.entity;
      const mask = ['pipelines'];
      // FIXME - refactor below for multi env, because it cannot overwrite entity properties
      // if (this.state[`modelEnv_${multiEnvIndex}`]) {
      //   Object.keys(this.state[`modelEnv_${multiEnvIndex}`]).forEach((key) => {
      //     if (!mask.includes(key)) {
      //       entity[key] = this.state[`modelEnv_${multiEnvIndex}`][key];
      //     }
      //   });
      // }
      let isDelta = false;
      Object.keys(entityDevelopment).forEach((key) => {
        if (!mask.includes(key) && entityDevelopment[key] !== entity[key]) isDelta = true;
      });
      const toolboxConfig = [];
      if (multiEnvDelta) {
        if (isDelta) {
          toolboxConfig.push({
            action: 'delete',
            svg: iconRevert,
            onClick: this.resetEnvEntity,
          });
        }
      } else {
        if (multiEnvIndex === 0) {
          toolboxConfig.push({
            action: 'delete',
            svg: iconTrash,
            onClick: () => this.setState({showRemovingModal: true}),
          });
        }
        toolboxConfig.push({
          action: 'edit',
          svg: iconEdit,
          onClick: this._handleEdit,
        });
      }
      return (
            <Entity
              ref={(r) => {this.entityRef = r}}
              type={this.props.entity.constructor.type}
              connector={this.props.entity.constructor.type === 'DataSource' ? this.props.entity.connector : undefined}
              editable={this.state.editable}
              expanded={this.state.expanded}
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
              isDelta={isDelta}
            >
              <ComposedComponent
                ref={(ref) => this.element = ref}
                parent={this}
                {...this.props}
                {...this.state}
                entity={entity}
                entityDevelopment={entityDevelopment}
                onFieldUpdate={this._handleFieldUpdate}
                onResetField={this._handleResetField}
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
