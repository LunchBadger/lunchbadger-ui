import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {DragSource} from 'react-dnd';
import _ from 'lodash';
import classNames from 'classnames';
import './ApiEndpoint.scss';

const Port = LunchBadgerCore.components.Port;
const {coreActions} = LunchBadgerCore.utils;

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
  isDragging: monitor.isDragging()
}))

class ApiEndpoint extends Component {
  static propTypes = {
    parent: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    hideSourceOnDrag: PropTypes.bool.isRequired,
    handleEndDrag: PropTypes.func,
  };

  static contextTypes = {
    store: PropTypes.object,
  };

  renderPorts() {
    return this.props.entity.ports.map((port) => {
      return (
        <Port
          key={`port-${port.portType}-${port.id}`}
          way={port.portType}
          middle={true}
          elementId={port.id}
          scope={port.portGroup}
        />
      );
    });
  }

  handleClick = () => {
    const {parent, entity} = this.props;
    this.context.store.dispatch(coreActions.toggleSubelement(parent, entity));
  }

  render() {
    const {connectDragSource, currentlySelectedSubelements} = this.props;
    const elementClass = classNames('api-endpoint', {
      'api-endpoint--selected': _.find(currentlySelectedSubelements, {id: this.props.id})
    });
    return connectDragSource(
      <div className={elementClass} onClick={this.handleClick}>
        {this.renderPorts()}
        <div className="api-endpoint__info">
          <div className="api-endpoint__icon">
            <i className="fa fa-globe"/>
          </div>
          <div className="api-endpoint__name">
            {this.props.entity.name}
          </div>
        </div>
      </div>
    );
  }
}

const selector = createSelector(
  state => state.states.currentlySelectedParent,
  state => state.states.currentlySelectedSubelements,
  state => !!state.states.currentEditElement,
  (currentlySelectedParent, currentlySelectedSubelements, isCurrentEditElement) => ({
    currentlySelectedParent, currentlySelectedSubelements, isCurrentEditElement
  }),
);

export default connect(selector)(ApiEndpoint);
