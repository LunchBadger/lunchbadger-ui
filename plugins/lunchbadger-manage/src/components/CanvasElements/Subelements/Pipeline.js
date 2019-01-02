import React, {PureComponent} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {DragSource} from 'react-dnd';
import '../Gateway.scss';

const {
  UI: {
    entityIcons,
    IconSVG,
    CollapsibleProperties,
    IconButton,
    EntityProperty,
  },
  utils: {
    coreActions: {toggleSubelement},
  },
} = LunchBadgerCore;

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
      connectDragPreview,
      entity,
      parent,
      idx,
      renderPipelinePorts,
      renderPipeline,
      removePipeline,
    } = this.props;
    return connectDragSource(
      <div className={`Gateway__pipeline${idx}`}>
        {renderPipelinePorts(entity)}
        <CollapsibleProperties
          id={`${parent.id}/CANVAS/PIPELINES/${entity.id}`}
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
          buttonOnHover
        />
        {connectDragPreview(
          <div className="draggable-group__preview">
            <div className="draggable-group__preview__icon">
              <IconSVG svg={entityIcons.Gateway}/>
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

export default connect(selector, null, null, {withRef: true})(Pipeline);
