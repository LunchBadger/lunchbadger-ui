import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import _ from 'lodash';
import {EntitySubElements} from '../../../../lunchbadger-ui/src';
import Model from './Subelements/Model';
import {bundle, unbundle, rebundle} from '../../reduxActions/models';
import './Microservice.scss';

const CanvasElement = LunchBadgerCore.components.CanvasElement;
const DraggableGroup = LunchBadgerCore.components.DraggableGroup;
const ElementsBundler = LunchBadgerCore.components.ElementsBundler;
const TwoOptionModal = LunchBadgerCore.components.TwoOptionModal;

class Microservice extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    parent: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowingModal: false,
      bundledItem: null,
    }
    this.modelsRefs = [];
  }

  renderModels() {
    return this.props.models.map((model, idx) => (
      <Model
        key={idx}
        parent={this.props.entity}
        id={model.id}
        entity={model}
        left={0}
        top={0}
        handleEndDrag={this.handleEndDrag}
        hideSourceOnDrag={true}
        index={idx}
        ref={r => this.modelsRefs[idx] = r}
      />
    ));
  }

  handleEndDrag = item => {
    if (item) {
      this.setState({
        isShowingModal: true,
        bundledItem: item,
      });
    }
  }

  handleModalConfirm = () => {
    const item = this.state.bundledItem;
    const {entity} = item;
    this.props.dispatch(unbundle(item.parent, entity));
  }

  handleModalClose = () => this.setState({isShowingModal: false});

  bundleModel = (microservice, model) => this.props.dispatch(bundle(microservice, model));

  moveBetweenMicroservice = (from, to, model) => this.props.dispatch(rebundle(from, to, model));

  processModel = model => {
    if (!model.models) model.models = [];
    model.models.forEach((item, idx) => {
      model.models[idx] = this.modelsRefs[idx]
        .getWrappedInstance()
        .getDecoratedComponentInstance()
        .refs
        .model
        .getWrappedInstance()
        .getDecoratedComponentInstance()
        .getDecoratedComponentInstance()
        .element.processModel(item);
    });
    return model;
  }

  render() {
    return (
      <div>
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
