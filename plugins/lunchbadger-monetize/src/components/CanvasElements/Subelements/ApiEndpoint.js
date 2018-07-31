import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {DragSource} from 'react-dnd';
import _ from 'lodash';
import {EntityProperty, CollapsibleProperties} from '../../../../../lunchbadger-ui/src';
import {toggleSubelement} from '../../../../../lunchbadger-core/src/reduxActions';
import './ApiEndpoint.scss';

const Port = LunchBadgerCore.components.Port;
const {ApiEndpointComponent} = LunchBadgerManage.components;

const boxSource = {
  beginDrag(props) {
    const {entity, left, top, parent, handleEndDrag} = props;
    return {entity, left, top, parent, handleEndDrag, subelement: true};
  },
  endDrag(props) {
    const {entity, left, top, parent, handleEndDrag} = props;
    return {entity, left, top, parent, handleEndDrag, subelement: true};
  },
  canDrag(props) {
    const {currentlySelectedParent, currentlySelectedSubelements, isCurrentEditElement} = props;
    if (currentlySelectedParent && currentlySelectedParent.id === props.parent.id && currentlySelectedSubelements.length) {
      return false;
    }
    return !isCurrentEditElement;
  }
};

@DragSource('canvasElement', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))

class SubApiEndpoint extends Component {
  static propTypes = {
    parent: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    hideSourceOnDrag: PropTypes.bool.isRequired,
    handleEndDrag: PropTypes.func,
  };

  renderPorts() {
    return this.props.entity.ports.map((port) => {
      return (
        <Port
          key={`port-${port.portType}-${port.id}`}
          way={port.portType}
          middle
          elementId={port.id}
          scope={port.portGroup}
        />
      );
    });
  }

  handleClick = () => {
    const {parent, entity, dispatch} = this.props;
    setTimeout(() => dispatch(toggleSubelement(parent, entity)));
  }

  render() {
    const {
      connectDragSource,
      connectDragPreview,
      currentlySelectedSubelements,
      entity,
      index,
      id,
      validations,
      handleDeleteApiEndpoint,
    } = this.props;
    return connectDragSource(
      <div className="SubApiEndpoint">
        {this.renderPorts()}
        <CollapsibleProperties
          ref={(r) => {this.collapsiblePropertiesDOM = r;}}
          bar={
            <EntityProperty
              name={`apiEndpoints[${index}][name]`}
              value={entity.name}
              hiddenInputs={[
                {name: `apiEndpoints[${index}][id]`, value: entity.id},
                {name: `apiEndpoints[${index}][itemOrder]`, value: entity.itemOrder}
              ]}
              onViewModeClick={this.toggleCollapsibleProperties}
              onClick={this.handleClick}
              selected={!!_.find(currentlySelectedSubelements, {id})}
              onChange={this.handleNameChange}
              invalid={validations.data.name || ''}
              onDelete={handleDeleteApiEndpoint(entity.id)}
            />
          }
          collapsible={
            <ApiEndpointComponent
              ref="apiEndpoint"
              entity={entity}
              nested
              index={index}
              validationsForced={validations}
            />
          }
          defaultOpened
        />
        {connectDragPreview(
          <div className="draggable-group__preview">
            <div className="draggable-group__preview__icon">
              <i className={'icon-icon-product'}/>
            </div>
            <div className="draggable-group__preview__items">
              <div className="draggable-group__preview__title">
                {entity.name}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const selector = createSelector(
  state => state.states.currentlySelectedParent,
  state => state.states.currentlySelectedSubelements,
  state => !!state.states.currentEditElement,
  (
    currentlySelectedParent,
    currentlySelectedSubelements,
    isCurrentEditElement,
  ) => ({
    currentlySelectedParent,
    currentlySelectedSubelements,
    isCurrentEditElement,
  }),
);

export default connect(selector, null, null, {withRef: true})(SubApiEndpoint);
