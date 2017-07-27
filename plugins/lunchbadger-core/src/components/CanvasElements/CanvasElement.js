import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import './CanvasElement.scss';
import {findDOMNode} from 'react-dom';
import classNames from 'classnames';
import {DragSource, DropTarget} from 'react-dnd';
import {
  setCurrentElement,
  clearCurrentElement,
  setCurrentEditElement,
} from '../../reduxActions';
import _ from 'lodash';
import TwoOptionModal from '../Generics/Modal/TwoOptionModal';
import {IconSVG, Entity, EntityActionButtons, EntityValidationErrors} from '../../../../lunchbadger-ui/src';
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
  hover: _.debounce((props, monitor, component) => { //FIXME
    const dragIndex = monitor.getItem().itemOrder;
    const hoverIndex = props.itemOrder;
    // if (dragIndex === hoverIndex) {
    //   return;
    // }
    if (props.isPanelOpened) {
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
    props.moveEntity(item.id, dragIndex || 0, hoverIndex || 0);
    // monitor.getItem().itemOrder = hoverIndex;
  }, 300),

  canDrop(props, monitor) {
    const item = monitor.getItem();
    return _.includes(props.entity.accept, item.entity.metadata.type);
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

    static contextTypes = {
      multiEnvIndex: PropTypes.number,
      multiEnvDelta: PropTypes.bool,
      multiEnvAmount: PropTypes.number,
      store: PropTypes.object,
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
      // this._handleOnOver(props);
      this._handleDrop(props);
      // this.checkHighlightAndEditableState(props);
    }

    componentWillUpdate(props, state) {
      // // if (JSON.stringify(props) !== JSON.stringify(this.props)) {
      // //   console.log('DIFF PROPS', this.props.entity.data.name);
      //   Object.keys(props).forEach((key) => {
      //     if (props[key] !== this.props[key]) {
      //       console.log('DIFF props', this.props.entity.data.name, key, props[key], this.props[key]);
      //     }
      //   });
      // // }
      // // if (JSON.stringify(state) !== JSON.stringify(this.state)) {
      // //   console.log('DIFF STATE', this.props.entity.data.name);
      //   Object.keys(state).forEach((key) => {
      //     if (state[key] !== this.state[key]) {
      //       console.log('DIFF state', this.props.entity.data.name, key, state[key], this.state[key]);
      //     }
      //   });
      // // }
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
      //   this.props.toggleEdit(this.props.entity);
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

    componentWillUnmount() {
      // this.handleChangeListeners('removeChangeListener');
    }

    handleChangeListeners = (action) => {
      // FIXME - replace with plugins redux
      // LunchBadgerCompose.stores.Backend[action](this.refresh);
      // LunchBadgerCore.stores.Pluggable[action](this.refresh);
      // LunchBadgerCore.stores.Connection[action](this.refresh);
      // LunchBadgerManage.stores.Public[action](this.refresh);
      // LunchBadgerManage.stores.Gateway[action](this.refresh);
      // LunchBadgerManage.stores.Private[action](this.refresh);
      // LunchBadgerOptimize.stores.Forecast[action](this.refresh);
    }

    refresh = () => {
      this.forceUpdate();
    }

    update = async (data) => {
      const {store: {dispatch, getState}} = this.context;
      const state = getState();
      const {plugins} = state;
      const {entity} = this.props;
      const {type} = entity.metadata;
      const onValidate = plugins.onValidate[type];
      const invalid = onValidate(entity, data, state);
      const isValid = Object.keys(invalid).length === 0;
      this.setState({validations: {isValid, data: invalid}});
      if (!isValid) return;
      dispatch(setCurrentEditElement(null));
      const onUpdate = plugins.onUpdate[type];
      const updatedEntity = await dispatch(onUpdate(_.merge({}, entity, {data})));
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
      //   this.props.toggleEdit(null);
      // }
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

    _handleOnOver(props) {
      // if (!this.props.canDrop) {
      //   return;
      // }
      // if (!this.props.isOver && props.isOver) {
      //   this.setState({highlighted: true});
      // }
      // if (this.props.isOver && !props.isOver) {
      //   this.setState({highlighted: false});
      // }
    }

    _handleDrop(props) {
      if (this.props.isDragging && !props.isDragging && props.saveOrder) {
        props.saveOrder();
      }
    }

    handleRemove = () => {
      const {entity} = this.props;
      const {store: {dispatch, getState}} = this.context;
      dispatch(getState().plugins.onDelete[entity.metadata.type](entity));
    }

    handleEdit = (event) => {
      const {multiEnvIndex, multiEnvDelta} = this.context;
      if (multiEnvDelta && multiEnvIndex > 0) {
        event.stopPropagation();
        return;
      }
      this.context.store.dispatch(setCurrentEditElement(this.props.entity));
      event.stopPropagation();
    }

    handleCancel = (event) => {
      event.persist();
      const {store: {dispatch, getState}} = this.context;
      const {entity} = this.props;
      dispatch(getState().plugins.onDiscardChanges[entity.metadata.type](entity));
      if (entity.metadata.loaded) {
        if (!this.state.isValid) {
          this.setState({validations: {isValid: true, data: {}}});
        }
        if (this.entityRef.getFormRef()) {
          this.entityRef.getFormRef().reset(entity.data);
        }
      } else {
        dispatch(clearCurrentElement());
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
      // this.props.toggleEdit(null);
      // this.setState({editable: false, validations: {isValid: true, data:{}}}, () => {
      //   this.toggleHighlighted();
      // });
      // if (this.element && this.element.discardChanges) {
      //   this.element.discardChanges();
      // }
      event.preventDefault();
      event.stopPropagation();
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

    handleClick = (event) => {
      this.context.store.dispatch(setCurrentElement(this.props.entity));
      event.stopPropagation();
    }

    propertiesMapping = key => ['_pipelines'].includes(key) ? key.replace(/_/, '') : key;

    render() {
      const {multiEnvIndex, multiEnvDelta} = this.context;
      const {entity, connectDragSource, connectDropTarget, dragging, icon, editable, highlighted} = this.props;
      const {metadata} = entity;
      const {processing} = metadata;
      const {validations} = this.state;
      const elementClass = classNames({
        'canvas-element': true,
        editable: editable && !processing,
        highlighted,
        dragging,
        wip: processing,
        invalid: !validations.isValid,
      });
      const entityDevelopment = {...this.state.modelEnv_0};
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
          onClick: this.handleEdit,
        });
      }
      // console.log('RENDER CANVASELEMENT', this.props.entity.data.name);
      return (
            <Entity
              ref={(r) => {this.entityRef = r}}
              type={this.props.entity.metadata.type}
              connector={this.props.entity.metadata.type === 'DataSource' ? this.props.entity.data.connector : undefined}
              editable={editable}
              highlighted={highlighted}
              dragging={dragging}
              wip={processing}
              invalid={!validations.isValid}
              toolboxConfig={toolboxConfig}
              name={this.props.entity.data.name}
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
                entity={entity}
                entityDevelopment={entityDevelopment}
                onFieldUpdate={this.handleFieldUpdate}
                onResetField={this._handleResetField}
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
    state => state.states.currentElement,
    state => state.states.currentEditElement,
    state => !!state.core.appState.currentlyOpenedPanel,
    (_, props) => props.entity.metadata.id,
    (
      currentElement,
      currentEditElement,
      isPanelOpened,
      id,
    ) => {
      const highlighted = !!currentElement && currentElement.metadata.id === id;
      const editable = !!currentEditElement && currentEditElement.metadata.id === id;
      return {
        isPanelOpened,
        highlighted,
        editable,
      };
    },
  );

  return connect(connector)(CanvasElement);
}
