import React, {Component, PropTypes} from 'react';
import './API.scss';
import {DragSource} from 'react-dnd';
import _ from 'lodash';
import PublicEndpoint from './SubPublicEndpoint';
import classNames from 'classnames';

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
export default class API extends Component {
  static propTypes = {
    parent: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    connectDragSource: PropTypes.func,
    isDragging: PropTypes.bool,
    id: PropTypes.any.isRequired,
    paper: PropTypes.object,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    hideSourceOnDrag: PropTypes.bool,
    handleEndDrag: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  renderEndpoints() {
    return this.props.entity.publicEndpoints.map((api) => {
      return (
        <div key={api.id} className="canvas-element__sub-element canvas-element__sub-element--api">
          <PublicEndpoint
            parent={this.props.entity}
            {...this.props}
            key={api.id}
            id={api.id}
            entity={api}
            paper={this.props.paper}/>
        </div>
      );
    });
  }

  render() {
    const {connectDragSource} = this.props;
    const selectedElements = this.props.appState.getStateKey('currentlySelectedSubelements');

    const elementClass = classNames({
      'api': true,
      'api--selected': _.find(selectedElements, {id: this.props.id})
    });

    return connectDragSource(
      <div className={elementClass} onClick={() => toggleSubelement(this.props.parent, this.props.entity)}>
        <div className="api__info">
          <div className="api__icon">
            <i className="icon-icon-product"/>
          </div>
          <div className="api__name">
            {this.props.entity.name}
          </div>
        </div>

        <div className="canvas-element__sub-elements">
          <div className="canvas-element__sub-elements__title">
            Endpoints
          </div>
          <div className="canvas-element__endpoints" ref="endpoints">
            {this.renderEndpoints()}
          </div>
        </div>
      </div>
    );
  }
}
