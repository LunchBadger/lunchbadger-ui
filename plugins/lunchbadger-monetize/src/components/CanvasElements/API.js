import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Plan from './Subelements/Plan';
import {EntitySubElements} from '../../../../lunchbadger-ui/src';
import ApiEndpointComponent from './Subelements/ApiEndpoint';
import {bundle, unbundle, rebundle} from '../../reduxActions/apis';
import './API.scss';

const {TwoOptionModal, CanvasElement, DraggableGroup, ElementsBundler} = LunchBadgerCore.components;

class API extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    parent: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.previousConnection = null;
    this.state = {
      isShowingModal: false,
      bundledItem: null,
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
    .getDecoratedComponentInstance()
    .getDecoratedComponentInstance()
    .element;

  processModel = model => {
    if (!model.apiEndpoints) model.apiEndpoints = [];
    model.apiEndpoints = model.apiEndpoints.map(({id}, idx) => this.getSubApiEndpoint(id).processModel(model.apiEndpoints[idx]));
    return model;
  }

  handleDeleteApiEndpoint = id => () => this.setState({apiEndpoints: this.state.apiEndpoints.filter((item) => item.id !== id)});

  discardChanges = callback => this.onPropsUpdate(this.props, () => {
    this.state.apiEndpoints.forEach(({id}) => this.getSubApiEndpoint(id).discardChanges());
    callback && callback();
  });

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

  _handleClose = () => {
    this.setState({isShowingModal: false});
  }

  bundle = (api, endpoint) => {
    const {store: {dispatch}} = this.context;
    dispatch(bundle(api, endpoint));
  }

  rebundle = (fromApi, toApi, endpoint) => {
    const {store: {dispatch}} = this.context;
    dispatch(rebundle(fromApi, toApi, endpoint));
  }

  unbundle = () => {
    const item = this.state.bundledItem;
    const {store: {dispatch}} = this.context;
    dispatch(unbundle(item.parent, item.entity));
  }

  render() {
    const {entity, parent} = this.props;
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
              iconClass="icon-icon-product"
              entity={entity}
            >
              {this.renderEndpoints()}
            </DraggableGroup>
          </div>
          <div className="canvas-element__drop">
            <ElementsBundler
              {...this.props}
              canDropCheck={
                (item) => _.includes(entity.accept, item.entity.constructor.type)
                && !_.includes(entity.apiEndpoints, item.entity)
              }
              onAddCheck={(item) => !_.includes(entity.apiEndpoints, item.entity)}
              onAdd={this.bundle}
              onMove={this.rebundle}
              parent={parent}
              entity={entity}
            />
          </div>
        </EntitySubElements>
        {this.state.isShowingModal && (
          <TwoOptionModal
            title="Unbundle API"
            confirmText="Yes"
            discardText="No"
            onClose={this._handleClose}
            onSave={this.unbundle}
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

export default CanvasElement(API);
