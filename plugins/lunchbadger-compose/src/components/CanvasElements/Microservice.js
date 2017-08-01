import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import classNames from 'classnames';
import _ from 'lodash';
import {EntitySubElements} from '../../../../lunchbadger-ui/src';
import Model from './Subelements/Model';
import updateMicroservice from '../../actions/CanvasElements/Microservice/update';
import {bundleStart, bundleFinish} from '../../actions/CanvasElements/Microservice/bundle';
import {unbundleStart, unbundleFinish} from '../../actions/CanvasElements/Microservice/unbundle';
import moveBetweenMicroservice from '../../actions/CanvasElements/Microservice/rebundle';
import removeModel from '../../actions/CanvasElements/Model/remove';
import updateModel from '../../actions/CanvasElements/Model/update';
import removeEntity from '../../actions/CanvasElements/remove';

const CanvasElement = LunchBadgerCore.components.CanvasElement;
const DraggableGroup = LunchBadgerCore.components.DraggableGroup;
const ElementsBundler = LunchBadgerCore.components.ElementsBundler;
const TwoOptionModal = LunchBadgerCore.components.TwoOptionModal;
const Private = LunchBadgerManage.stores.Private;
const Connection = LunchBadgerCore.stores.Connection;

class Microservice extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object,
    parent: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.previousConnection = null;
    this.state = {
      hasTargetConnection: false,
      hasSourceConnection: false,
      isShowingModal: false,
      bundledItem: null
    }
  }

  // componentDidMount() {
  //   this.props.paper.bind('connectionDetached', this.onConnectionDetached);
  // }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextState === null || this.state.hasTargetConnection !== nextState.hasTargetConnection) {
      const hasConnection = nextProps.entity.models.some((modelId) => {
        return Connection.getConnectionsForTarget(modelId).length;
      });

      if (hasConnection) {
        this.setState({hasTargetConnection: true});
      } else {
        this.setState({hasTargetConnection: false});
      }
    }

    if (nextState === null || this.state.hasSourceConnection !== nextState.hasSourceConnection) {
      const hasConnection = nextProps.entity.models.some((modelId) => {
        return Connection.getConnectionsForSource(modelId).length;
      });

      if (hasConnection) {
        this.setState({hasSourceConnection: true});
      } else {
        this.setState({hasSourceConnection: false});
      }
    }
  }

  // componentWillUnmount() {
  //   this.props.paper.unbind('connectionDetached', this.onConnectionDetached);
  // }

  onConnectionDetached = (info) => {
    this.previousConnection = info;
  };

  update = model => updateMicroservice(this.props.entity.id, model);

  removeEntity = () => {
    const {entity} = this.props;
    entity.models.forEach((modelId) => {
      const model = Private.findEntity(modelId);
      model && removeModel(model);
    });
    removeEntity(entity);
  }

  renderModels() {
    return null;
    return this.props.models.map((entity, idx) => (
      <Model
        key={idx}
        {...this.props}
        parent={this.props.entity}
        id={entity.id}
        entity={entity}
        paper={null}
        left={entity.metadata.left}
        top={entity.metadata.top}
        handleEndDrag={(item) => this.handleEndDrag(item)}
        hideSourceOnDrag={true}
        index={idx}
      />
    ));
  }

  handleEndDrag(item) {
    if (item) {
      this.setState({
        isShowingModal: true,
        bundledItem: item
      });
    }
  }

  handleModalConfirm = () => {
    const item = this.state.bundledItem;
    const {entity} = item;
    const modelData = {
      name: entity.name,
      contextPath: entity.contextPath,
      wasBundled: false
    };
    unbundleStart(item.parent);
    updateModel(entity.lunchbadgerId || entity.id, modelData)
      .then(() => unbundleFinish(item.parent, entity));
  }

  handleModalClose = () => this.setState({isShowingModal: false});

  bundleMicroservice = (microservice, bundledItem) => {
    const modelData = {
      name: bundledItem.name,
      contextPath: bundledItem.contextPath,
      wasBundled: true
    };

    bundleStart(microservice);

    updateModel(bundledItem.id, modelData)
      .then(() => bundleFinish(microservice, bundledItem));
  }

  render() {
    const elementClass = classNames({
      'has-connection-in': this.state.hasTargetConnection,
      'has-connection-out': this.state.hasSourceConnection
    });

    return (
      <div className={elementClass}>
        <EntitySubElements
          title="Models"
          main
        >
          <DraggableGroup
            iconClass="icon-icon-microservice"
            entity={this.props.entity}
          >
            {this.renderModels()}
          </DraggableGroup>
        </EntitySubElements>
        <div className="canvas-element__drop">
          <ElementsBundler
            {...this.props}
            canDropCheck={
              (item) => _.includes(this.props.entity.accept, item.entity.constructor.type)
              && !_.includes(this.props.entity.models, item.entity.lunchbadgerId)
            }
            onAddCheck={(item) => !_.includes(this.props.entity.models, item.entity.lunchbadgerId)}
            onAdd={this.bundleMicroservice}
            onMove={moveBetweenMicroservice}
            dropText="Drag Models Here"
            modalTitle="Bundle Microservice"
            parent={this.props.parent}
            entity={this.props.entity}
          />
        </div>
        {this.state.isShowingModal && (
          <TwoOptionModal
            title="Unbundle Microservice"
            confirmText="Yes"
            discardText="No"
            onClose={this.handleModalClose}
            onSave={this.handleModalConfirm}
          >
            <span>
              Are you sure you want to unbundle
              "{this.state.bundledItem.entity.name}"
              from
              "{this.props.entity.name}"?
            </span>
          </TwoOptionModal>
        )}
      </div>
    );
  }
}

const connector = createSelector(
  (_, props) => props.entity.models,
  state => state.entities.models,
  (ids, models) => ({ids}), //models.filter(({data: {lunchbadgerId}}) => ids.includes(lunchbadgerId))}),
);

export default connect(connector)(CanvasElement(Microservice));
