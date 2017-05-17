import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './PublicEndpoint.scss';
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
export default class PublicEndpoint extends Component {
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
    index: PropTypes.number,
  };

  constructor(props) {
    super(props);
  }

  renderPorts() {
    return this.props.entity.ports.map((port) => {
      return (
        <Port key={`port-${port.portType}-${port.id}`}
              paper={this.props.paper}
              way={port.portType}
              middle={true}
              elementId={`${this.props.entity.id}`}
              ref={`port-${port.portType}`}
              scope={port.portGroup}
              offsetTop={96 + this.props.index * 32}
        />
      );
    });
  }

  render() {
    const {connectDragSource} = this.props;
    const selectedElements = this.props.appState.getStateKey('currentlySelectedSubelements');

    const elementClass = classNames({
      'public-endpoint': true,
      'public-endpoint--selected': _.find(selectedElements, {id: this.props.id})
    });

    return connectDragSource(
      <div className={elementClass} onClick={() => toggleSubelement(this.props.parent, this.props.entity)}>
        <div className="public-endpoint__info">
          <div className="public-endpoint__icon">
            <i className="fa fa-globe"/>
          </div>
          <div className="public-endpoint__name">
            {this.props.entity.name}
          </div>

          {this.renderPorts()}
        </div>
      </div>
    );
  }
}
