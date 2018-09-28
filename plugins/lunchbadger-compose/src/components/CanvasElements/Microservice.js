import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import _ from 'lodash';
import {EntitySubElements} from '../../../../lunchbadger-ui/src';
import ModelComponent from './Subelements/Model';
import {
  bundle,
  unbundle,
  rebundle,
  rebundleMultiple,
} from '../../reduxActions/models';
import './Microservice.scss';

const {
  components: {
    CanvasElement,
    DraggableGroup,
    ElementsBundler,
    TwoOptionModal,
  },
  utils: {
    coreActions,
  },
} = LunchBadgerCore;

class Microservice extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    parent: PropTypes.object
  };

  static contextTypes = {
    paper: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowingModal: false,
      isShowingModalMultiple: false,
      bundledItem: null,
      bundledItems: [],
      models: props.models,
    }
    this.onPropsUpdate = (props = this.props, callback) => this.setState({models: props.models}, callback);
    this.modelsRefs = {};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entity !== this.props.entity || nextProps.models !== this.props.models) {
      this.onPropsUpdate(nextProps);
    }
  }

  handleEndDrag = item => {
    if (item) {
      this.setState({
        isShowingModal: true,
        bundledItem: item,
      });
    }
  };

  handleModalConfirm = () => {
    const item = this.state.bundledItem;
    const {entity} = item;
    this.props.dispatch(unbundle(item.parent, entity));
  };

  handleModalClose = () => this.setState({isShowingModal: false});

  bundleModel = (microservice, model) => this.props.dispatch(bundle(microservice, model));

  moveBetweenMicroservice = (from, to, model) =>
    this.props.dispatch(rebundle(from, to, model));

  moveMultipleBetweenMicroservice = (from, to, models) =>
    this.props.dispatch(rebundleMultiple(from, to, models));

  handleMultipleUnbundle = () => this.setState({
    isShowingModalMultiple: true,
    bundledItems: this.props.currentlySelectedSubelements,
  });

  handleModalMultipleClose = () => this.setState({isShowingModalMultiple: false});

  handleModalMultipleConfirm = () => {
    const {entity, dispatch} = this.props;
    this.state.bundledItems.forEach(item => dispatch(unbundle(entity, item)));
    dispatch(coreActions.clearCurrentElement());
  };

  handleDropCheck = (item) => {
    const {entity} = this.props;
    const accept = _.includes(entity.accept, item.constructor.type);
    const bundled = _.includes(entity.models, item.lunchbadgerId);
    return accept && !bundled;
  };

  getSubModel = id => this.modelsRefs[id]
    .getWrappedInstance()
    .getDecoratedComponentInstance()
    .refs
    .model
    .getWrappedInstance()
    .getDecoratedComponentInstance()
    .getDecoratedComponentInstance()
    .element;

  processModel = model => {
    if (!model.models) model.models = [];
    model.models.forEach(({lunchbadgerId}, idx) => {
      model.models[idx] = this.getSubModel(lunchbadgerId).processModel(model.models[idx]);
    });
    return model;
  }

  onRemove = () => this.props.entity.beforeRemove(this.context.paper.getInstance());

  handleDeleteModel = id => () => this.setState({models: this.state.models.filter((model) => model.id !== id)});

  discardChanges = callback => this.onPropsUpdate(this.props, () => {
    this.state.models.forEach(({lunchbadgerId}) => this.getSubModel(lunchbadgerId).discardChanges());
    callback && callback();
  });

  renderModels = () => {
    const {entity, validations: {data: {models: data = {}}}} = this.props;
    const {models} = this.state;
    return models.map((model, idx) => {
      const validations = data[model.id] ? {data: data[model.id], isValid: false} : {data: {}, isValid: true};
      return <ModelComponent
        key={idx}
        parent={entity}
        id={model.id}
        entity={model}
        left={0}
        top={0}
        handleEndDrag={this.handleEndDrag}
        hideSourceOnDrag
        index={idx}
        ref={r => this.modelsRefs[model.id] = r}
        validations={validations}
        handleDeleteModel={this.handleDeleteModel}
      />;
    });
  }

  render() {
    const {entity, parent} = this.props;
    const {
      isShowingModal,
      isShowingModalMultiple,
      bundledItem,
      bundledItems,
    } = this.state;
    return (
      <div>
        <EntitySubElements
          title="Models"
          main
        >
          <DraggableGroup
            icon="Model"
            entity={entity}
            groupEndDrag={this.handleMultipleUnbundle}
          >
            {this.renderModels()}
          </DraggableGroup>
        </EntitySubElements>
        <div className="canvas-element__drop">
          <ElementsBundler
            {...this.props}
            canDropCheck={this.handleDropCheck}
            onAddCheck={(item) => !_.includes(entity.models, item.entity.lunchbadgerId)}
            onAdd={this.bundleModel}
            onMove={this.moveBetweenMicroservice}
            onMoveMultiple={this.moveMultipleBetweenMicroservice}
            dropText="Drag Models Here"
            modalTitle="Bundle Microservice"
            parent={parent}
            entity={entity}
          />
        </div>
        {isShowingModal && (
          <TwoOptionModal
            title="Unbundle Microservice"
            confirmText="Yes"
            discardText="No"
            onClose={this.handleModalClose}
            onSave={this.handleModalConfirm}
          >
            <span>
              Are you sure you want to unbundle
              "{bundledItem.entity.name}"
              from
              "{entity.name}"?
            </span>
          </TwoOptionModal>
        )}
        {isShowingModalMultiple && (
          <TwoOptionModal
            title="Unbundle Microservice"
            confirmText="Yes"
            discardText="No"
            onClose={this.handleModalMultipleClose}
            onSave={this.handleModalMultipleConfirm}
          >
            <span>
              Are you sure you want to unbundle
              "{bundledItems.map(({name}) => name).join(', ')}"
              from
              "{entity.name}"?
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
  state => state.states.currentlySelectedSubelements,
  (ids, models, currentlySelectedSubelements) => ({
    models: ids.map(id => models[id]).filter(item => !!item),
    currentlySelectedSubelements,
  }),
);

export default connect(connector, null, null, {withRef: true})(CanvasElement(Microservice));
