import React, {Component, PropTypes} from 'react';
import './PublicEndpoint.scss';
import {DragSource} from 'react-dnd';

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
    return !props.appState.getStateKey('currentEditElement');
  }
};

@DragSource('canvasElement', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class PublicEndpoint extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    paper: PropTypes.object,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    hideSourceOnDrag: PropTypes.bool.isRequired,
    handleEndDrag: PropTypes.func
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
              scope={port.portGroup}/>
      );
    });
  }

  render() {
    const {connectDragSource} = this.props;
    return connectDragSource(
      <div className="public-endpoint">
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
