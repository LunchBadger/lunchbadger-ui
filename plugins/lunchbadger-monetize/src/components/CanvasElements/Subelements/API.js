import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classNames from 'classnames';
import _ from 'lodash';
import {DragSource} from 'react-dnd';
import PublicEndpoint from './SubPublicEndpoint';
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
  isDragging: monitor.isDragging()
}))

class API extends Component {
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

    this.state = {
      opened: true
    };
  }

  renderEndpoints() {
    return this.props.entity.publicEndpoints.map((api, index) => {
      return (
        <PublicEndpoint
          key={api.id}
          parent={this.props.entity}
          {...this.props}
          key={api.id}
          id={api.id}
          entity={api}
          paper={this.props.paper}
          APIsOpened={this.props.APIsOpened}
          APIId={this.props.entity.id}
          index={index}
          indexAPI={this.props.index}
          APIsPublicEndpoints={this.props.APIsPublicEndpoints}
          expanded={this.state.opened}
        />
      );
    });
  }

  toggleOpenState = () => {
    this.setState({opened: !this.state.opened});
    this.props.onToggleOpen(!this.state.opened);
  }

  render() {
    const {connectDragSource, currentlySelectedSubelements} = this.props;
    const elementClass = classNames({
      subapi: true,
      'subapi--opened': this.state.opened,
      'subapi--closed': !this.state.opened
    });
    const apiInfoClass = classNames({
      'subapi__info': true,
      'subapi__info--selected': _.find(currentlySelectedSubelements, {id: this.props.id})
    });
    return connectDragSource(
      <div>
        <CollapsibleProperties
          bar={(
            <span className="Portal__APIs__title">
              {this.props.entity.name}
            </span>
          )}
          collapsible={
            <div>
              <EntityPropertyLabel className="Pipeline__policies">Endpoints</EntityPropertyLabel>
              {this.renderEndpoints()}
            </div>
          }
          onToggleCollapse={this.toggleOpenState}
          defaultOpened
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentlySelectedParent: state.core.appState.currentlySelectedParent,
  currentlySelectedSubelements: state.core.appState.currentlySelectedSubelements,
  isCurrentEditElement: !!state.core.appState.currentEditElement,
});

export default connect(mapStateToProps)(API);
