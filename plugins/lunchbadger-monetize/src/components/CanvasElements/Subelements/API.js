import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
// import classNames from 'classnames';
import _ from 'lodash';
import {DragSource} from 'react-dnd';
import ApiEndpoint from './SubApiEndpoint';
import {EntityPropertyLabel, CollapsibleProperties} from '../../../../../lunchbadger-ui/src';
import './API.scss';

// FIXME - handle toggleSubelement

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

class API extends Component {
  static propTypes = {
    parent: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    connectDragSource: PropTypes.func,
    connectDragPreview: PropTypes.func,
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
    this.state = {
      opened: true,
      marginTopPorts: {},
    };
  }

  renderEndpoints() {
    return this.props.entity.apiEndpoints.map((api) => {
      return (
        <ApiEndpoint
          key={api.id}
          entity={api}
        />
      );
    });
  }

  toggleOpenState = () => {
    const opened = !this.state.opened;
    const apiOffsetTop = this.refs.api.offsetTop;
    this.refs.data.querySelectorAll('.port__middle').forEach((portRef) => {
      if (!opened) {
        const marginTop = +window.getComputedStyle(portRef).marginTop.replace('px', '');
        this.state.marginTopPorts[portRef.id] = marginTop;
        portRef.style.marginTop = `${-portRef.offsetTop + apiOffsetTop + marginTop + 9}px`;
      } else {
        portRef.style.marginTop = `${this.state.marginTopPorts[portRef.id]}px`;
      }
    });
    this.state.opened = opened;
  }

  render() {
    const {
      connectDragSource,
      connectDragPreview,
      entity,
      // currentlySelectedSubelements,
    } = this.props;
    // const elementClass = classNames({
    //   subapi: true,
    //   'subapi--opened': this.state.opened,
    //   'subapi--closed': !this.state.opened
    // });
    // const apiInfoClass = classNames({
    //   'subapi__info': true,
    //   'subapi__info--selected': _.find(currentlySelectedSubelements, {id: this.props.id})
    // });
    return connectDragSource(
      <div className="Portal__APIs">
        <div ref="api">
          <CollapsibleProperties
            bar={(
              <span className="Portal__APIs__title">
                {entity.name}
              </span>
            )}
            collapsible={
              <div ref="data">
                <EntityPropertyLabel className="Pipeline__policies">Endpoints</EntityPropertyLabel>
                {this.renderEndpoints()}
              </div>
            }
            onToggleCollapse={this.toggleOpenState}
            defaultOpened
          />
        </div>
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

export default connect(selector)(API);
