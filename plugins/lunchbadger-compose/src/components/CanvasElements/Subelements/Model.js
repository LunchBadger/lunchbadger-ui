import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
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

class Model extends Component {
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

  handleClick = () => {
    const {parent, entity, toggleSubelement} = this.props;
    toggleSubelement(parent, entity);
  }

  render() {
    const {connectDragSource, currentlySelectedSubelements} = this.props;
    const elementClass = classNames({
      'model': true,
      'model--selected': _.find(currentlySelectedSubelements, {id: this.props.id})
    });
    return connectDragSource(
      <div className={elementClass} onClick={this.handleClick}>
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

const mapStateToProps = state => ({
  currentlySelectedParent: state.core.appState.currentlySelectedParent,
  currentlySelectedSubelements: state.core.appState.currentlySelectedSubelements,
  isCurrentEditElement: !!state.core.appState.currentEditElement,
});

const mapDispatchToProps = dispatch => ({
  toggleSubelement: (parent, subelement) => dispatch(toggleSubelement(parent, subelement)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Model);
