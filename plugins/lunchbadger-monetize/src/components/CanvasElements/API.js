import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import _ from 'lodash';
import Plan from './Subelements/Plan';
import ApiEndpointComponent from './Subelements/ApiEndpoint';
import {
  bundle,
  unbundle,
  rebundle,
  rebundleMultiple,
} from '../../reduxActions/apis';
import './API.scss';

const {
  components: {
    TwoOptionModal,
    CanvasElement,
    DraggableGroup,
    ElementsBundler,
  },
  utils: {
    coreActions,
  },
  UI: {EntitySubElements},
} = LunchBadgerCore;

class API extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    parent: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object,
    paper: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.previousConnection = null;
    this.state = {
      isShowingModal: false,
      isShowingModalMultiple: false,
      bundledItem: null,
      bundledItems: [],
      apiEndpoints: props.entity.apiEndpoints,
    };
    this.onPropsUpdate = (props = this.props, callback) => this.setState({apiEndpoints: props.entity.apiEndpoints}, callback);
    this.apiEndpointsRefs = {};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entity !== this.props.entity) {
      this.onPropsUpdate(nextProps);
    }
  }

  getSubApiEndpoint = id => this.apiEndpointsRefs[id]
    .getWrappedInstance()
    .getDecoratedComponentInstance()
    .refs
    .apiEndpoint
    .getWrappedInstance()
    .getWrappedInstance()
    .getDecoratedComponentInstance()
    .getDecoratedComponentInstance()
    .element
    .wrappedInstance;

  processModel = model => {
    if (!model.apiEndpoints) model.apiEndpoints = [];
    model.apiEndpoints = model.apiEndpoints.map(({id}, idx) => this.getSubApiEndpoint(id).processModel(model.apiEndpoints[idx]));
    return model;
  }

  onRemove = () => this.props.entity.beforeRemove(this.context.paper.getInstance());

  handleDeleteApiEndpoint = id => () => this.setState({apiEndpoints: this.state.apiEndpoints.filter((item) => item.id !== id)});

  discardChanges = callback => this.onPropsUpdate(this.props, () => {
    this.state.apiEndpoints.forEach(({id}) => this.getSubApiEndpoint(id).discardChanges());
    callback && callback();
  });

  handleMultipleUnbundle = () => this.setState({
    isShowingModalMultiple: true,
    bundledItems: this.props.currentlySelectedSubelements,
  });

  handleCloseMultiple = () => this.setState({isShowingModalMultiple: false});

  handleModalMultipleConfirm = () => {
    const {entity, dispatch} = this.props;
    this.state.bundledItems.forEach(item => dispatch(unbundle(entity, item)));
    dispatch(coreActions.clearCurrentElement());
  };

  renderPlans = () => {
    return this.props.entity.plans.map(plan => <Plan key={plan.id} entity={plan} />);
  }

  renderEndpoints = () => {
    const {entity, validations: {data: {apiEndpoints: data = {}}}} = this.props;
    const {apiEndpoints} = this.state;
    return apiEndpoints.map((apiEndpoint, idx) => {
      const validations = data[apiEndpoint.id] ? {data: data[apiEndpoint.id], isValid: false} : {data: {}, isValid: true};
      return (
        <ApiEndpointComponent
          key={apiEndpoint.id}
          parent={entity}
          id={apiEndpoint.id}
          entity={apiEndpoint}
          left={apiEndpoint.left || 0}
          top={apiEndpoint.top || 0}
          handleEndDrag={(item) => this._handleEndDrag(item)}
          hideSourceOnDrag
          ref={r => this.apiEndpointsRefs[apiEndpoint.id] = r}
          index={idx}
          validations={validations}
          handleDeleteApiEndpoint={this.handleDeleteApiEndpoint}
        />
      );
    });
  }

  _handleEndDrag(item) {
    if (item) {
      this.setState({
        isShowingModal: true,
        bundledItem: item
      });
    }
  }

  handleClose = () => this.setState({isShowingModal: false});

  bundle = (api, endpoint) => {
    const {store: {dispatch}} = this.context;
    dispatch(bundle(api, endpoint));
  };

  rebundle = (fromApi, toApi, endpoint) => {
    const {store: {dispatch}} = this.context;
    dispatch(rebundle(fromApi, toApi, endpoint));
  };

  rebundleMultiple = (fromApi, toApi, endpoints) => {
    const {store: {dispatch}} = this.context;
    dispatch(rebundleMultiple(fromApi, toApi, endpoints));
  };

  unbundle = () => {
    const item = this.state.bundledItem;
    const {store: {dispatch}} = this.context;
    dispatch(unbundle(item.parent, item.entity));
  };

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
        {entity.plans.length > 0 && (
          <EntitySubElements
            title="Plans"
          >
            {this.renderPlans()}
          </EntitySubElements>
        )}
        <EntitySubElements
          title="Endpoints"
          main
        >
          <div className="canvas-element__endpoints" ref="endpoints">
            <DraggableGroup
              icon="ApiEndpoint"
              entity={entity}
              groupEndDrag={this.handleMultipleUnbundle}
            >
              {this.renderEndpoints()}
            </DraggableGroup>
          </div>
          <div className="canvas-element__drop">
            <ElementsBundler
              {...this.props}
              canDropCheck={
                (item) => _.includes(entity.accept, item.constructor.type)
                && !_.includes(entity.apiEndpoints, item)
              }
              onAddCheck={(item) => !_.includes(entity.apiEndpoints, item.entity)}
              onAdd={this.bundle}
              onMove={this.rebundle}
              onMoveMultiple={this.rebundleMultiple}
              parent={parent}
              entity={entity}
            />
          </div>
        </EntitySubElements>
        {isShowingModal && (
          <TwoOptionModal
            title="Unbundle API"
            confirmText="Yes"
            discardText="No"
            onClose={this.handleClose}
            onSave={this.unbundle}
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
            title="Unbundle API"
            confirmText="Yes"
            discardText="No"
            onClose={this.handleCloseMultiple}
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
  state => state.states.currentlySelectedSubelements,
  (currentlySelectedSubelements) => ({
    currentlySelectedSubelements,
  }),
);

export default connect(connector, null, null, {withRef: true})(CanvasElement(API));
