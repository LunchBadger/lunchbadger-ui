import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import PublicEndpoint from './Subelements/PublicEndpoint';
import Plan from './Subelements/Plan';
import {bundle, unbundle, rebundle} from '../../reduxActions/apis';
import {EntitySubElements} from '../../../../lunchbadger-ui/src';
import './API.scss';

const TwoOptionModal = LunchBadgerCore.components.TwoOptionModal;
const CanvasElement = LunchBadgerCore.components.CanvasElement;
const DraggableGroup = LunchBadgerCore.components.DraggableGroup;
const ElementsBundler = LunchBadgerCore.components.ElementsBundler;

class API extends Component {
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
      isShowingModal: false,
      bundledItem: null
    }
  }

  componentDidMount() {
    // this.props.paper.bind('connectionDetached', (info) => {
    //   this.previousConnection = info;
    // });
  }

  renderPlans = () => {
    return this.props.entity.plans.map(plan => <Plan key={plan.id} entity={plan} />);
  }

  renderEndpoints = () => {
    return this.props.entity.publicEndpoints.map((api, idx) => (
      <PublicEndpoint
        key={idx}
        parent={this.props.entity}
        id={api.id}
        entity={api}
        left={api.left || 0}
        top={api.top || 0}
        handleEndDrag={(item) => this._handleEndDrag(item)}
        hideSourceOnDrag={true}
        index={idx}
      />
    ));
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
    return (
      <div>
        {this.props.entity.plans.length > 0 && (
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
              entity={this.props.entity}
            >
              {this.renderEndpoints()}
            </DraggableGroup>
          </div>
          <div className="canvas-element__drop">
            <ElementsBundler
              {...this.props}
              canDropCheck={
                (item) => _.includes(this.props.entity.accept, item.entity.constructor.type)
                && !_.includes(this.props.entity.publicEndpoints, item.entity)
              }
              onAddCheck={(item) => !_.includes(this.props.entity.publicEndpoints, item.entity)}
              onAdd={this.bundle}
              onMove={this.rebundle}
              parent={this.props.parent}
              entity={this.props.entity}
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
