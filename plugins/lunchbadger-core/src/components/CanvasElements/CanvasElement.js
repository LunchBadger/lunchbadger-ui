import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import './CanvasElement.scss';
import {findDOMNode} from 'react-dom';
import {DragSource, DropTarget} from 'react-dnd';
import _ from 'lodash';
import {
  setCurrentElement,
  clearCurrentElement,
  setCurrentEditElement,
} from '../../reduxActions';
import {actions} from '../../reduxActions/actions';
import getFlatModel from '../../utils/getFlatModel';
import TwoOptionModal from '../Generics/Modal/TwoOptionModal';
import {Entity} from '../../../../lunchbadger-ui/src';
import {iconTrash, iconEdit, iconRevert} from '../../../../../src/icons';

const boxSource = {
  beginDrag: (props) => {
    const {entity, id, itemOrder} = props;
    return {entity, id, itemOrder};
  },
  canDrag: (props) => {
    return !props.editable;
  }
};

const boxTarget = {
  hover: _.debounce((props, monitor, component) => {
    const item = monitor.getItem();
    if (!item) return;
    const dragIndex = item.itemOrder;
    const hoverIndex = props.itemOrder;
    // if (dragIndex === hoverIndex) {
    //   return;
    // }
    if (props.isPanelOpened) return;
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    // const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    // const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    if (dragIndex < hoverIndex && clientOffset.y < hoverBoundingRect.bottom - 15) return;
    if (dragIndex > hoverIndex && clientOffset.y > hoverBoundingRect.top + 15) return;
    if (item.subelement) return;
    props.moveEntity(item.id, dragIndex || 0, hoverIndex || 0);
    // monitor.getItem().itemOrder = hoverIndex;
  }, 300),

  canDrop(props, monitor) {
    const item = monitor.getItem();
    return _.includes(props.entity.accept, item.entity.constructor.type);
  },

  drop(props, monitor, component) {
    const item = monitor.getItem();
    const element = component.element.decoratedComponentInstance || component.element;
    if (props.isPanelOpened) {
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
  class CanvasElement extends PureComponent {
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
      this.state = {
        showRemovingModal: false,
        validations: {
          isValid: true,
          data: {}
        },
        // modelBeforeEdit: null,
        // modelEnv_0: null,
      };
      this.multiEnvIndex = 0;
      // this.checkHighlightAndEditableState = (props) => {
      //   const currentElement = props.currentElement;
      //   if (currentElement && currentElement.data.id === this.props.entity.data.id) {
      //     if (!this.state.highlighted) {
      //       console.log(111, currentElement.data.id, this.props.entity.data.id);
      //       this.setState({highlighted: true});
      //     }
      //   } else {
      //     this.setState({highlighted: false});
      //   }
      // };
    }

    componentWillReceiveProps(props) {
      this._handleDrop(props);
      // this.checkHighlightAndEditableState(props);
    }

    componentDidMount() {
      // this.handleChangeListeners('addChangeListener');
      // if (this.props.entity.metadata.wasBundled) {
      //   this.setState({
      //     editable: false,
      //     expanded: false,
      //     validations: {isValid: true, data:{}}
      //   });
      //   return;
      // }
      // if (this.props.entity.metadata.loaded) {
      //   this.setState({
      //     editable: false,
      //     // expanded: false,
      //     validations: {isValid: true, data:{}},
      //     modelBeforeEdit: this.entityRef.getFormRef().getModel(),
      //     modelEnv_0: this.entityRef.getFormRef().getModel(),
      //   });
      // } else if (this.props.entity.metadata.ready) {
      //   this.triggerElementAutofocus();
      // }
      // // this.checkHighlightAndEditableState(this.props);
      // this.props.entity.metadata.elementDOM = this.elementDOM;
    }

    componentDidUpdate() {
      // const element = this.element.decoratedComponentInstance || this.element;
      // if (typeof element.getEntityDiffProps === 'function') {
      //   const modelBeforeEdit = element.getEntityDiffProps(this.state.modelBeforeEdit);
      //   if (modelBeforeEdit !== null) {
      //     this.setState({
      //       modelBeforeEdit,
      //       modelEnv_0: modelBeforeEdit,
      //     });
      //   }
      // }
      // this.props.entity.metadata.elementDOM = this.elementDOM;
      // const {multiEnvIndex} = this.context;
      // if (this.multiEnvIndex !== multiEnvIndex) {
      //   LunchBadgerCore.multiEnvIndex = multiEnvIndex;
      //   this.multiEnvIndex = multiEnvIndex;
      //   const newState = {...this.state};
      //   if (!this.state[`modelEnv_${multiEnvIndex}`]) {
      //     newState[`modelEnv_${multiEnvIndex}`] = _.cloneDeep(this.state.modelEnv_0);
      //   }
      //   this.setState(newState, () => {
      //     this.entityRef.getFormRef().reset(this.state[`modelEnv_${multiEnvIndex}`]);
      //     this.forceUpdate();
      //   });
      // }
    }


    refresh = () => {
      this.forceUpdate();
    }

    update = async (props) => {
      const {entity, dispatch} = this.props;
      let model = props;
      const element = this.element.decoratedComponentInstance || this.element;
      if (typeof element.processModel === 'function') {
        model = element.processModel(model);
      }
      const validations = dispatch(entity.validate(model));
      this.setState({validations});
      if (!validations.isValid) return;
      dispatch(setCurrentEditElement(null));
      // const onUpdate = entity.update;
      // const updatedEntity = await dispatch(onUpdate(_.merge({}, entity, model)));
      const updatedEntity = await dispatch(entity.update(model));
      dispatch(setCurrentElement(updatedEntity));
      // update currentElement

      // const {multiEnvIndex, multiEnvAmount} = this.context;
      // if (multiEnvIndex === 0 && this.state.modelEnv_0) {
      //   const newState = {};
      //   let isChange = false;
      //   Object.keys(model).forEach((key) => {
      //     if (this.state.modelEnv_0[key] !== model[key]) {
      //       isChange = true;
      //       for (let i = 1; i < multiEnvAmount; i += 1) {
      //         if (!newState[`modelEnv_${i}`]) {
      //           newState[`modelEnv_${i}`] = {...this.state[`modelEnv_${i}`]};
      //         }
      //         newState[`modelEnv_${i}`][key] = model[key];
      //       }
      //     }
      //   });
      //   if (isChange) {
      //     this.setState(newState);
      //   }
      // }
      // const element = this.element.decoratedComponentInstance || this.element;
      // let updated;
      // if (typeof element.update === 'function') {
      //   // updated = element.update(model);
      //   const {store: {dispatch, getState}} = this.context;
      //   const entity = _.merge({}, this.props.entity, {data: model});
      //   dispatch(getState().plugins.onUpdate[entity.metadata.type](entity));
      //   this.setState({
      //     modelBeforeEdit: model,
      //     [`modelEnv_${multiEnvIndex}`]: model,
      //   });
      // }
      // if (typeof updated === 'undefined' || updated) {
      //   if (updated) {
      //     this.setState({validations: updated});
      //     if (!updated.isValid) {
      //       return;
      //     }
      //   }
      //   this.setState({editable: false, validations: {isValid: true, data:{}}});
      // }
// =======
//       let updated;
//       if (typeof element.update === 'function') {
//         updated = element.update(model);
//       }
//       if (typeof updated === 'undefined' || updated) {
//         if (updated) {
//           this.setState({validations: updated});
//           if (!updated.isValid) {
//             return;
//           }
//         }
//         this.setState({editable: false, validations: {isValid: true, data:{}}});
//         toggleEdit(null);
//       }
//       let modelBeforeEdit = this.entityRef.getFormRef().getModel();
//       if (typeof element.getModelAfterUpdate === 'function') {
//         modelBeforeEdit = element.getModelAfterUpdate(modelBeforeEdit);
//       }
//       this.setState({
//         modelBeforeEdit,
//         [`modelEnv_${multiEnvIndex}`]: modelBeforeEdit,
//       });
// >>>>>>> development
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

    _handleDrop(props) {
      if (this.props.isDragging && !props.isDragging && props.saveOrder) {
        props.saveOrder();
      }
    }

    handleRemove = () => {
      const {entity, dispatch} = this.props;
      dispatch(entity.remove());
      dispatch(actions.removeEntity(entity));
      dispatch(clearCurrentElement());
    }

    handleEdit = (event) => {
      const {dispatch, multiEnvIndex, multiEnvDelta} = this.props;
      if (multiEnvDelta && multiEnvIndex > 0) {
        event.stopPropagation();
        return;
      }
      dispatch(setCurrentEditElement(this.props.entity));
      event.stopPropagation();
    }

    handleCancel = (event) => {
      event.persist();
      const {entity, dispatch} = this.props;
      if (!entity.loaded) {
        dispatch(entity.remove());
        dispatch(actions.removeEntity(entity));
        dispatch(clearCurrentElement());
      } else {
        if (!this.state.isValid) {
          this.setState({validations: {isValid: true, data: {}}});
        }
        const element = this.element.decoratedComponentInstance || this.element;
        if (typeof element.discardChanges === 'function') {
          element.discardChanges(() => {
            if (this.entityRef.getFormRef()) {
              this.entityRef.getFormRef().reset(getFlatModel(entity.toJSON()));
            }
          });
        } else {
          if (this.entityRef.getFormRef()) {
            this.entityRef.getFormRef().reset(getFlatModel(entity.toJSON()));
          }
        }
      }
      dispatch(setCurrentEditElement(null));
      // if (this.state.modelBeforeEdit === null) {
      //   // this.handleRemove();
      //   event.preventDefault();
      //   event.stopPropagation();
      //   return;
      // }
      // if (this.entityRef.getFormRef()) {
      //   this.entityRef.getFormRef().reset(this.state.modelBeforeEdit);
      // }
      // const element = this.element.decoratedComponentInstance || this.element;
      // if (typeof element.discardChanges === 'function') {
      //   element.discardChanges();
      // }
      // this.setState({editable: false, validations: {isValid: true, data:{}}}, () => {
      //   this.toggleHighlighted();
      // });
      // if (this.element && this.element.discardChanges) {
      //   this.element.discardChanges();
      // }
      event.preventDefault();
      event.stopPropagation();
// =======
//     getFlatModel = () => {
//       const model = {};
//       this.feedFlatModel(this.state.modelBeforeEdit, model);
//       return model;
//     }
//
//     feedFlatModel = (json, data, prefix = '') => {
//       Object.keys(json).forEach((key) => {
//         const pfx = prefix ? `[${key}]` : key;
//         if (Array.isArray(json[key])) {
//           json[key].forEach((item, idx) => {
//             this.feedFlatModel(item, data, `${prefix}${pfx}[${idx}]`);
//           });
//         } else {
//           data[`${prefix}${pfx}`] = json[key];
//         }
//       });
//     }
//
//     _handleCancel = (evt) => {
//       evt.persist();
//       if (this.state.modelBeforeEdit === null) {
//         this._handleRemove();
//         evt.preventDefault();
//         evt.stopPropagation();
//         return;
//       }
//       const element = this.element.decoratedComponentInstance || this.element;
//       if (typeof element.discardChanges === 'function') {
//         element.discardChanges();
//       }
//       if (this.entityRef.getFormRef()) {
//         this.entityRef.getFormRef().reset(this.getFlatModel());
//       }
//       toggleEdit(null);
//       this.setState({editable: false, validations: {isValid: true, data:{}}}, () => {
//         this.toggleHighlighted();
//       });
//       evt.preventDefault();
//       evt.stopPropagation();
// >>>>>>> development
    }

    handleFieldUpdate = (field, value) => {
      const data = Object.assign({}, this.state.validations.data);
      if (data[field] && value !== '') {
        delete data[field];
      }
      const isValid = Object.keys(data).length === 0;
      this.setState({validations: {isValid, data}});
    }

    handleValidationFieldClick = field => ({target}) => {
      const closestCanvasElement = target.closest('.Entity');
      const closestInput = closestCanvasElement && closestCanvasElement.querySelector(`#${field}`);
      if (closestInput) {
        closestInput.focus();
      }
    }

    handleResetMultiEnvEntity = () => {
      const {multiEnvIndex: index, entity, dispatch} = this.props;
      dispatch(actions.multiEnvironmentsUpdateEntity({index, entity}));
    }

    handleResetMultiEnvEntityField = field => () => {
      const {multiEnvIndex: index, entity: {id, [field]: value}, dispatch} = this.props;
      dispatch(actions.multiEnvironmentsResetEntityField({index, id, field, value}));
    }

    handleClick = (event) => {
      const {entity, dispatch} = this.props;
      dispatch(setCurrentElement(entity));
      event.stopPropagation();
    }

    propertiesMapping = key => ['_pipelines'].includes(key) ? key.replace(/_/, '') : key;

    render() {
      const {entity, connectDragSource, connectDropTarget, isDragging, editable, highlighted, multiEnvIndex, multiEnvDelta, multiEnvEntity} = this.props;
      const {ready} = entity;
      const processing = !ready;
      const {validations} = this.state;
      let isDelta = entity !== multiEnvEntity;
      const toolboxConfig = [];
      if (multiEnvDelta) {
        if (isDelta) {
          toolboxConfig.push({
            action: 'delete',
            svg: iconRevert,
            onClick: this.handleResetMultiEnvEntity,
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
          onClick: this.handleEdit,
        });
      }
      // console.log('RENDER CANVASELEMENT', this.props.entity.name);
      return (
            <Entity
              ref={(r) => {this.entityRef = r}}
              type={this.props.entity.constructor.type}
              connector={this.props.entity.constructor.type === 'DataSource' ? this.props.entity.connector : undefined}
              editable={editable}
              highlighted={highlighted}
              dragging={isDragging}
              wip={processing}
              invalid={!validations.isValid}
              toolboxConfig={toolboxConfig}
              name={this.props.entity.name}
              onNameChange={this.updateName}
              onCancel={this.handleCancel}
              validations={validations}
              onFieldClick={this.handleValidationFieldClick}
              onValidSubmit={this.update}
              onClick={this.handleClick}
              onDoubleClick={this.handleEdit}
              connectDragSource={connectDragSource}
              connectDropTarget={connectDropTarget}
              isDelta={isDelta}
            >
              <ComposedComponent
                ref={(ref) => this.element = ref}
                parent={this}
                {...this.props}
                {...this.state}
                entity={multiEnvEntity}
                entityDevelopment={entity}
                onFieldUpdate={this.handleFieldUpdate}
                onResetField={this.handleResetMultiEnvEntityField}
                multiEnvIndex={multiEnvIndex}
              />
              {this.state.showRemovingModal && (
                <TwoOptionModal
                  onClose={() => this.setState({showRemovingModal: false})}
                  onSave={this.handleRemove}
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

  const connector = createSelector(
    state => state.multiEnvironments,
    state => state.states.currentElement,
    state => state.states.currentEditElement,
    state => !!state.states.currentlyOpenedPanel,
    (_, props) => props.entity,
    (
      multiEnvironments,
      currentElement,
      currentEditElement,
      isPanelOpened,
      entity,
    ) => {
      const {id} = entity;
      const multiEnvIndex = multiEnvironments.selected;
      const multiEnvDelta = multiEnvironments.environments[multiEnvIndex].delta;
      let multiEnvEntity = entity;
      if (multiEnvIndex > 0 && multiEnvironments.environments[multiEnvIndex].entities[id]) {
        multiEnvEntity = multiEnvironments.environments[multiEnvIndex].entities[id];
      }
      const highlighted = !!currentElement && currentElement.id === id;
      const editable = !!currentEditElement && currentEditElement.id === id;
      return {
        multiEnvIndex,
        multiEnvDelta,
        multiEnvEntity,
        isPanelOpened,
        highlighted,
        editable,
      };
    },
  );

  return connect(connector)(CanvasElement);
}
