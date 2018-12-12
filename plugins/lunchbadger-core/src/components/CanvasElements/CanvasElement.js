import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import slug from 'slug';
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
  clearCurrentEditElement,
  setCurrentZoom,
  setPendingEdit,
} from '../../reduxActions';
import {actions} from '../../reduxActions/actions';
import TwoOptionModal from '../Generics/Modal/TwoOptionModal';
import OneOptionModal from '../Generics/Modal/OneOptionModal';
import userStorage from '../../utils/userStorage';
import {
  Entity,
  EntityError,
  EntityStatus,
  scrollToElement,
  SystemDefcon1,
  GAEvent,
  UIDefaults,
} from '../../../../lunchbadger-ui/src';
import getFlatModel from '../../utils/getFlatModel';

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
    if (props.isPanelOpened) return;
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const clientOffset = monitor.getClientOffset();
    if (dragIndex < hoverIndex && clientOffset.y < hoverBoundingRect.bottom - 15) return;
    if (dragIndex > hoverIndex && clientOffset.y > hoverBoundingRect.top + 15) return;
    if (item.subelement) return;
    props.moveEntity(item.id, dragIndex || 0, hoverIndex || 0);
  }, 300),

  canDrop(props, monitor) {
    const item = monitor.getItem();
    return _.includes(props.entity.accept, item.entity.constructor.type);
  },

  drop(props, monitor, component) {
    const item = monitor.getItem();
    const element = component.element.wrappedInstance || component.element;
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
      entity: PropTypes.object.isRequired,
      connectDragSource: PropTypes.func.isRequired,
      isDragging: PropTypes.bool.isRequired,
      itemOrder: PropTypes.number,
      isOver: PropTypes.bool,
      canDrop: PropTypes.bool
    };

    constructor(props) {
      super(props);
      this.state = {
        showRemovingModal: false,
        showNotRunningModal: false,
        showEntityError: false,
        showUnlockModal: false,
        validations: {
          isValid: true,
          data: {}
        },
        zoomFactor: userStorage.getNumber('zoomLevel') || UIDefaults.zoomFactor,
      };
    }

    componentWillReceiveProps(props) {
      const {entity, running, dispatch} = this.props;
      const {editable, highlighted} = props;
      this._handleDrop(props);
      if (props.entity !== entity) {
        setTimeout(() => {
          this.setFlatModel();
          this.resetFormModel();
        });
      }
      if ((editable || highlighted) && running && !props.running) {
        dispatch(clearCurrentEditElement());
        if (editable) {
          this.setState({showNotRunningModal: true});
        }
      }
    }

    componentDidMount() {
      this.setFlatModel();
      if (this.entityRef && !this.props.entity.loaded) {
        scrollToElement(findDOMNode(this.entityRef));
        document.getElementById('canvas').scrollIntoView(); // #1008
        const inputName = findDOMNode(this.entityRef.getInputNameRef()).querySelector('input');
        inputName.focus();
        inputName.setSelectionRange(0, inputName.value.length);
      }
      window.addEventListener('openDetailsPanelWithAutoscroll', this.openDetailsPanelWithAutoscroll);
      window.addEventListener('zoomFactorChanged', this.handleZoomFactorChanged);
    }

    componentWillUnmount() {
      window.removeEventListener('openDetailsPanelWithAutoscroll', this.openDetailsPanelWithAutoscroll);
      window.removeEventListener('zoomFactorChanged', this.handleZoomFactorChanged);
    }

    handleZoomFactorChanged = ({detail: {zoomFactor}}) => this.setState({zoomFactor});

    setFlatModel = () => {
      if (this.entityRef) {
        const model = this.props.entity.toModelJSON() || this.entityRef.getFormRef().getModel();
        this.state.model = getFlatModel(model);
      }
    }

    refresh = () => {
      this.forceUpdate();
    }

    update = async (props) => {
      const {entity, dispatch} = this.props;
      let model = _.cloneDeep(props);
      const element = this.element.wrappedInstance || this.element;
      if (typeof element.processModel === 'function') {
        model = element.processModel(model);
      }
      const validations = dispatch(entity.validate(model));
      this.setState({validations});
      if (!validations.isValid) return;
      if (typeof element.postProcessModel === 'function') {
        element.postProcessModel(props);
      }
      dispatch(setCurrentEditElement(null, true));
      const updatedEntity = await dispatch(entity.update(model));
      const gaAction = `${entity.loaded ? 'Updated' : 'Added'} Entity`;
      GAEvent('Canvas', gaAction, updatedEntity.gaType);
      setTimeout(() => {
        if (this.entityRef && this.entityRef.getFormRef()) {
          this.setFlatModel();
        }
      });
    }

    updateName = (evt) => {
      const element = this.element.wrappedInstance || this.element;
      if (typeof element.updateName === 'function') {
        element.updateName(evt);
      }
    };

    openDetailsPanelWithAutoscroll = ({detail: {entityId, tab, autoscrollSelector}}) => {
      if (this.props.entity.id === entityId) {
        this.handleZoom(tab)(autoscrollSelector)
      }
    };

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
      const element = this.element.wrappedInstance || this.element;
      let cb;
      if (typeof element.onRemove === 'function') {
        cb = element.onRemove();
      }
      const {id, gaType} = entity;
      userStorage.removeObjectKey('FilesEditorSize', id);
      userStorage.removeObjectKey('ResizableWrapperSize', id);
      userStorage.removeObjectKeyStartingWith('CollapsibleExpanded', id);
      dispatch(entity.remove(cb));
      dispatch(actions.removeEntity(entity));
      dispatch(clearCurrentElement());
      GAEvent('Canvas', 'Removed Entity', gaType);
    }

    handleEdit = () => {
      const {
        dispatch,
        multiEnvIndex,
        multiEnvDelta,
        entity: {
          isCanvasEditDisabled,
          locked,
          id,
        },
      } = this.props;
      const isAutogenerated = id.startsWith('autogenerated');
      if (locked) {
        this.setState({showUnlockModal: true});
        return;
      }
      if (isCanvasEditDisabled
        || (multiEnvDelta && multiEnvIndex > 0)
        || isAutogenerated
      ) {
        event.stopPropagation();
        return;
      }
      dispatch(setCurrentEditElement(this.props.entity));
    }

    handleZoom = tab => (autoscrollSelector) => {
      const {zoomWindow, gaType} = this.props.entity;
      const elementDOMRect = findDOMNode(this.entityRef).getBoundingClientRect();
      const {x, y, width, height} = elementDOMRect;
      const rect = {
        x: Math.round(x),
        y: Math.round(y),
        width: Math.round(width),
        height: Math.round(height),
        tab,
        zoomWindow,
        autoscrollSelector: typeof autoscrollSelector === 'string'
          ? autoscrollSelector
          : undefined,
      };
      this.props.dispatch(setCurrentZoom(rect));
      GAEvent('Zoom Window', 'Opened', `${gaType}: ${tab}`);
    };

    handleOnToggleCollapse = collapsed =>
      userStorage.setObjectKey('entityCollapsed', this.props.entity.id, collapsed);

    resetFormModel = () => {
      if (this.entityRef && this.entityRef.getFormRef()) {
        this.entityRef.getFormRef().reset(this.state.model);
      }
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
        const element = this.element.wrappedInstance || this.element;
        if (typeof element.discardChanges === 'function') {
          element.discardChanges(() => setTimeout(this.resetFormModel));
        } else {
          this.resetFormModel();
        }
      }
      dispatch(setCurrentEditElement(null));
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
    };

    handleResetMultiEnvEntity = () => {
      const {multiEnvIndex: index, entity, dispatch} = this.props;
      dispatch(actions.multiEnvironmentsUpdateEntity({index, entity}));
    };

    handleResetMultiEnvEntityField = field => () => {
      const {multiEnvIndex: index, entity: {id, [field]: value}, dispatch} = this.props;
      dispatch(actions.multiEnvironmentsResetEntityField({index, id, field, value}));
    };

    handleClick = (event) => {
      const {entity, dispatch, running} = this.props;
      const {ready, allowEditWhenCrashed} = entity;
      if (!ready || (!running && !allowEditWhenCrashed)) return;
      dispatch(setCurrentElement(entity));
      event.stopPropagation();
    };

    handleEntityErrorClicked = (event) => {
      this.handleClick(event);
      this.setState({showEntityError: true});
    };

    propertiesMapping = key => ['_pipelines'].includes(key) ? key.replace(/_/, '') : key;

    handleUnlock = () => {
      const {dispatch, entity: {id: entityId}} = this.props;
      dispatch(setPendingEdit('add', entityId, false, true));
      dispatch(actions.toggleLockEntity({locked: false, entityId}));
      this.handleEdit();
    };

    render() {
      const {
        entity,
        connectDragSource,
        connectDropTarget,
        isDragging,
        editable: editable_,
        highlighted,
        multiEnvIndex,
        multiEnvDelta,
        multiEnvEntity,
        nested,
        running,
        dispatch,
      } = this.props;
      if (nested) return (
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
      );
      const {
        id,
        ready,
        deleting,
        fake,
        isZoomDisabled,
        loaded,
        slugifyName,
        status,
        isCanvasEditDisabled,
        allowEditWhenCrashed,
        error,
        subtitle,
        gaType,
        locked,
      } = entity;
      const deploying = status === 'deploying';
      const processing = !ready || (!running && !allowEditWhenCrashed) || !!deleting || deploying;
      const semitransparent = !ready || !running;
      const {
        validations,
        showRemovingModal,
        showEntityError,
        showNotRunningModal,
        showUnlockModal,
        zoomFactor,
      } = this.state;
      let isDelta = entity !== multiEnvEntity;
      const toolboxConfig = [];
      const tabs = entity.tabs || [];
      const toolboxActions = entity.toolboxActions || [];
      const isAutogenerated = id.startsWith('autogenerated');
      if (multiEnvDelta) {
        if (isDelta) {
          toolboxConfig.push({
            action: 'delete',
            icon: 'iconRevert',
            onClick: this.handleResetMultiEnvEntity,
            label:'Revert changes',
          });
        }
      } else {
        if (multiEnvIndex === 0 && !deleting && !isAutogenerated) {
          toolboxConfig.push({
            action: 'delete',
            icon: 'iconTrash',
            onClick: () => this.setState({showRemovingModal: true}),
            label: 'Remove',
          });
        }
        if (!isZoomDisabled && (running || (!running && allowEditWhenCrashed && !deploying))) {
          if (!isAutogenerated) {
            toolboxActions.forEach(({name, icon, label, onClick}) => {
              toolboxConfig.push({
                action: name,
                icon,
                onClick: () => dispatch(onClick(entity)),
                label,
              });
            });
            toolboxConfig.push({
              action: 'zoom',
              icon: 'iconBasics',
              onClick: this.handleZoom('general'),
              label: 'Details',
            });
          }
          tabs.forEach(({name, icon, label}) => {
            toolboxConfig.push({
              action: name,
              icon,
              onClick: this.handleZoom(name),
              label,
            });
          });
        }
        if (!isCanvasEditDisabled && running && !isAutogenerated) {
          toolboxConfig.push({
            action: 'edit',
            icon: 'iconEdit',
            onClick: this.handleEdit,
            label: 'Quick Edit',
          });
        }
      }
      const {type, friendlyName} = this.props.entity.constructor;
      const editable = editable_ || !loaded;
      const defaultExpanded = !userStorage.getObjectKey('entityCollapsed', id);
      if (deleting) return null;
      return (
        <div
          className={cs('CanvasElement', type, status, {
            highlighted,
            editable,
            wip: processing,
            semitransparent,
            allowEditWhenCrashed: allowEditWhenCrashed,
            withStatus: !!status,
            autogenerated: id.startsWith('autogenerated'),
          })}
          style={{width: `${zoomFactor * 100}%`}}
        >
            <Entity
              ref={(r) => {this.entityRef = r}}
              type={type}
              connector={type === 'DataSource' ? this.props.entity.connector : undefined}
              editable={editable}
              highlighted={highlighted}
              dragging={isDragging}
              wip={processing}
              fake={fake}
              semitransparent={semitransparent}
              invalid={!validations.isValid}
              toolboxConfig={toolboxConfig}
              entityId={this.props.entity.id}
              name={this.props.entity.name}
              onNameChange={this.updateName}
              onNameBlur={this.handleFieldUpdate}
              onCancel={this.handleCancel}
              validations={validations}
              onValidSubmit={this.update}
              onClick={this.handleClick}
              onDoubleClick={this.handleEdit}
              connectDragSource={connectDragSource}
              connectDropTarget={connectDropTarget}
              isDelta={isDelta}
              slugifyName={slugifyName}
              onToggleCollapse={this.handleOnToggleCollapse}
              defaultExpanded={defaultExpanded}
              subtitle={subtitle}
              gaType={gaType}
              locked={locked}
            >
              {!fake && (
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
              )}
            </Entity>
            {showRemovingModal && (
              <TwoOptionModal
                onClose={() => this.setState({showRemovingModal: false})}
                onSave={this.handleRemove}
                onCancel={() => this.setState({showRemovingModal: false})}
                title="Remove entity"
                confirmText="Remove"
                discardText="Cancel"
              >
                Do you really want to remove that entity?
              </TwoOptionModal>
            )}
            {!error && (
              <EntityStatus
                type={friendlyName || type}
                status={status}
              />
            )}
            {error && <EntityError onClick={this.handleEntityErrorClicked} />}
            {showNotRunningModal && (
              <OneOptionModal
                confirmText="OK"
                onClose={() => this.setState({showNotRunningModal: false})}
              >
                Currently edited {type} stopped running.
              </OneOptionModal>
            )}
            {showEntityError && (
              <SystemDefcon1
                title={error.friendlyTitle}
                content={error.friendlyMessage}
                errors={[{error: {error}}]}
                defaultDetailsCollapse
                toggleErrorDetailsText='error details'
                onClose={() => this.setState({showEntityError: false})}
                hideRemoveButton
                buttons={error.buttons}
              />
            )}
            {showUnlockModal && (
              <TwoOptionModal
                onClose={() => this.setState({showUnlockModal: false})}
                onSave={this.handleUnlock}
                onCancel={() => this.setState({showUnlockModal: false})}
                title="Unlock entity"
                confirmText="Unlock"
                discardText="Cancel"
              >
                {'Are you sure, you want to unlock this entity?'}
                <br />
                {'You may overwritte pending edit in another session.'}
              </TwoOptionModal>
            )}
        </div>
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
      const {id, name, loaded, running: entityRunning, allowEditWhenCrashed} = entity;
      const running = entityRunning === undefined ? true : entityRunning;
      const multiEnvIndex = multiEnvironments.selected;
      const multiEnvDelta = multiEnvironments.environments[multiEnvIndex].delta;
      let multiEnvEntity = entity;
      if (multiEnvIndex > 0 && multiEnvironments.environments[multiEnvIndex].entities[id]) {
        multiEnvEntity = multiEnvironments.environments[multiEnvIndex].entities[id];
      }
      const highlighted = (!!running || (!running && !!allowEditWhenCrashed)) && !!currentElement && currentElement.id === id;
      const editable = !!running && !!currentEditElement && currentEditElement.id === id;
      return {
        multiEnvIndex,
        multiEnvDelta,
        multiEnvEntity,
        isPanelOpened,
        highlighted,
        editable,
        running,
      };
    },
  );

  return connect(connector, null, null, {withRef: true})(CanvasElement);
}
