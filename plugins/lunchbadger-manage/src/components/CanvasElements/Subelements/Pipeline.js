import React, {Component, PureComponent} from 'react';
// import PropTypes from 'prop-types';
import _ from 'lodash';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {DragSource} from 'react-dnd';
import {toggleSubelement} from '../../../../../lunchbadger-core/src/reduxActions';
import {
  CollapsibleProperties,
  IconButton,
  EntityProperty,
} from '../../../../../lunchbadger-ui/src';
import '../Gateway.scss';

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

class Pipeline extends PureComponent {

  handleClick = () => {
    const {parent, entity, dispatch} = this.props;
    setTimeout(() => dispatch(toggleSubelement(parent, entity)));
  }

  renderPipelineInput = (idx, pipeline) => {
    const {currentlySelectedSubelements} = this.props;
    const {id, name} = pipeline;
    return (
      <EntityProperty
        name={`pipelines[${idx}][name]`}
        value={name}
        placeholder="Enter pipeline name here"
        hiddenInputs={[{name: `pipelines[${idx}][id]`, value: id}]}
        onClick={this.handleClick}
        selected={!!_.find(currentlySelectedSubelements, {id})}
      />
    );
  }

  render() {
    const {
      connectDragSource,
      entity,
      idx,
      renderPipelinePorts,
      renderPipeline,
      removePipeline,
    } = this.props;
    return connectDragSource(
      <div className={`Gateway__pipeline${idx}`}>
        {renderPipelinePorts(entity)}
        <CollapsibleProperties
          bar={this.renderPipelineInput(idx, entity)}
          collapsible={renderPipeline(entity, idx)}
          button={(
            <IconButton
              name={`remove__pipelines${idx}`}
              icon="iconDelete"
              onClick={removePipeline(idx)}
            />
          )}
          defaultOpened
          space="0"
          noDividers
        />
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

export default connect(selector, null, null, {withRef: true})(Pipeline);
