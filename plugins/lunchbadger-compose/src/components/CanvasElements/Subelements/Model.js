import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {DragSource} from 'react-dnd';
import _ from 'lodash';
import classNames from 'classnames';
import {toggleSubelement} from '../../../../../lunchbadger-core/src/reduxActions';
import './Model.scss';

const Port = LunchBadgerCore.components.Port;

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

class Model extends PureComponent {
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
    const {store: {dispatch}} = this.context;
    const {parent, entity} = this.props;
    dispatch(toggleSubelement(parent, entity));
  }

  render() {
    const {connectDragSource, currentlySelectedSubelements} = this.props;
    const elementClass = classNames('model', {
      'model--selected': _.find(currentlySelectedSubelements, {id: this.props.id}),
    });
    return connectDragSource(
      <div className={elementClass} onClick={this.handleClick}>
        {this.renderPorts()}
        <div className="model__info">
          <div className="model__icon">
            <i className="fa fa-plug"/>
          </div>
          <div className="model__name">
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

export default connect(selector)(Model);
