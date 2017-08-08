import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import classNames from 'classnames';
import _ from 'lodash';
import {EntitySubElements} from '../../../../lunchbadger-ui/src';
import Model from './Subelements/Model';
// import {bundleStart, bundleFinish} from '../../actions/CanvasElements/Microservice/bundle';
// import {unbundleStart, unbundleFinish} from '../../actions/CanvasElements/Microservice/unbundle';
// import moveBetweenMicroservice from '../../actions/CanvasElements/Microservice/rebundle';
// import updateModel from '../../actions/CanvasElements/Model/update';
import {bundle, unbundle, rebundle} from '../../reduxActions/models';

const CanvasElement = LunchBadgerCore.components.CanvasElement;
const DraggableGroup = LunchBadgerCore.components.DraggableGroup;
const ElementsBundler = LunchBadgerCore.components.ElementsBundler;
const TwoOptionModal = LunchBadgerCore.components.TwoOptionModal;
const Connection = LunchBadgerCore.stores.Connection;

class Microservice extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object,
    parent: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object,
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

  renderModels() {
    return this.props.models.map((model, idx) => (
      <Model
        key={idx}
        parent={this.props.entity}
        id={model.id}
        entity={model}
        left={0}
        top={0}
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
    const {store: {dispatch}} = this.context;
    dispatch(unbundle(item.parent, entity));
    // unbundleStart(item.parent);
    // updateModel(entity.lunchbadgerId || entity.id, modelData)
    //   .then(() => unbundleFinish(item.parent, entity));
  }

  handleModalClose = () => this.setState({isShowingModal: false});

  bundleModel = (microservice, model) => {
    const {store: {dispatch}} = this.context;
    dispatch(bundle(microservice, model));
    // return;
    // const modelData = {
    //   name: bundledItem.name,
    //   contextPath: bundledItem.contextPath,
    //   wasBundled: true
    // };
    // bundleStart(microservice);
    // updateModel(bundledItem.id, modelData)
    //   .then(() => bundleFinish(microservice, bundledItem));
  }

  moveBetweenMicroservice = (fromMicroservice, toMicroservice, model) => {
    const {store: {dispatch}} = this.context;
    dispatch(rebundle(fromMicroservice, toMicroservice, model));
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
            onAdd={this.bundleModel}
            onMove={this.moveBetweenMicroservice}
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
  state => state.entities.modelsBundled,
  (ids, models) => ({
    models: ids.map(id => models[id]).filter(item => !!item),
  }),
);

export default connect(connector)(CanvasElement(Microservice));
