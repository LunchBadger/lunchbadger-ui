import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Model.scss';
import {DragSource} from 'react-dnd';
import _ from 'lodash';
import classNames from 'classnames';

const Port = LunchBadgerCore.components.Port;
const toggleSubelement = LunchBadgerCore.actions.toggleSubelement;

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
    const selectedParent = props.appState.getStateKey('currentlySelectedParent');
    const selectedElements = props.appState.getStateKey('currentlySelectedSubelements');

    if (selectedParent && selectedParent.id === props.parent.id && selectedElements.length) {
      return false;
    }

    return !props.appState.getStateKey('currentEditElement');
  }
};

@DragSource('canvasElement', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class Model extends Component {
  static propTypes = {
    parent: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    paper: PropTypes.object,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    hideSourceOnDrag: PropTypes.bool.isRequired,
    handleEndDrag: PropTypes.func,
    expanded: PropTypes.bool,
  };

  constructor(props) {
    super(props);
  }

  renderPorts() {
    return this.props.entity.ports.map((port) => {
      const key = `port-${port.portType}-${port.id}`;
      return (
        <Port key={key}
              paper={this.props.paper}
              way={port.portType}
              middle={true}
              elementId={`${this.props.entity.id}`}
              ref={`port-${port.portType}`}
              scope={this.props.expanded ? port.portGroup : key}
              offsetTop={85 + this.props.index * 24}
        />
      );
    });
  }

  render() {
    const {connectDragSource} = this.props;
    const selectedElements = this.props.appState.getStateKey('currentlySelectedSubelements');

    const elementClass = classNames({
      'model': true,
      'model--selected': _.find(selectedElements, {id: this.props.id})
    });

    return connectDragSource(
      <div className={elementClass} onClick={() => toggleSubelement(this.props.parent, this.props.entity)}>
        <div className="model__info">
          <div className="model__icon">
            <i className="fa fa-plug"/>
          </div>
          <div className="model__name">
            {this.props.entity.name}
          </div>
          {this.renderPorts()}
        </div>
      </div>
    );
  }
}
