import React, {Component, PropTypes} from 'react';
import PublicEndpoint from './Subelements/PublicEndpoint';
import Plan from './Subelements/Plan';
import updateAPI from '../../actions/CanvasElements/API/update';
import unbundleAPI from 'actions/CanvasElements/API/unbundle';
import APIDrop from './Subelements/APIDrop';
import classNames from 'classnames';
import './API.scss';

const TwoOptionModal = LunchBadgerCore.components.TwoOptionModal;
const Connection = LunchBadgerCore.stores.Connection;
const CanvasElement = LunchBadgerCore.components.CanvasElement;

class API extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object,
    parent: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.previousConnection = null;

    this.state = {
      hasConnection: null,
      isShowingModal: false,
      bundledItem: null
    }
  }

  componentDidMount() {
    this.props.paper.bind('connectionDetached', (info) => {
      this.previousConnection = info;
    });
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextState === null || this.state.hasConnection !== nextState.hasConnection) {
      const hasConnection = nextProps.entity.publicEndpoints.some((publicEndpoint) => {
        return Connection.getConnectionsForTarget(publicEndpoint.id).length;
      });

      if (hasConnection) {
        this.setState({hasConnection: true});
      } else {
        this.setState({hasConnection: false});
      }
    }
  }

  update(model) {
    updateAPI(this.props.entity.id, model);
  }

  renderPlans() {
    return this.props.entity.plans.map((plan) => {
      return (
        <div key={plan.id} className="canvas-element__sub-element">
          <Plan entity={plan}/>
        </div>
      )
    });
  }

  renderEndpoints() {
    return this.props.entity.publicEndpoints.map((endpoint) => {
      return (
        <div key={endpoint.id} className="canvas-element__sub-element">
          <PublicEndpoint
            {...this.props}
            parent={this.props.entity}
            key={endpoint.id}
            id={endpoint.id}
            entity={endpoint}
            paper={this.props.paper}
            left={endpoint.left}
            top={endpoint.top}
            handleEndDrag={(item) => this._handleEndDrag(item)}
            hideSourceOnDrag={true}/>
        </div>
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

  _handleModalConfirm() {
    const item = this.state.bundledItem;

    unbundleAPI(item.parent, item.entity);
  }

  _handleClose() {
    this.setState({isShowingModal: false});
  }

  render() {
    const elementClass = classNames({
      'has-connection': this.state.hasConnection
    });

    return (
      <div className={elementClass}>
        {
          this.props.entity.plans.length > 0 && (
            <div className="canvas-element__sub-elements">
              <div className="canvas-element__sub-elements__title">
                Plans
              </div>
              <div ref="plans">{this.renderPlans()}</div>
            </div>
          )
        }

        <div className="canvas-element__sub-elements">
          <div className="canvas-element__sub-elements__title">
            Endpoints
          </div>
          <div ref="endpoints">{this.renderEndpoints()}</div>
          <div className="canvas-element__drop">
            <APIDrop {...this.props} parent={this.props.parent} entity={this.props.entity} />
          </div>
        </div>

        {
          this.state.isShowingModal &&
          <TwoOptionModal title="Unbundle API"
                          confirmText="Yes"
                          discardText="No"
                          onClose={this._handleClose.bind(this)}
                          onSave={this._handleModalConfirm.bind(this)}>
            <span>
              Are you sure you want to unbundle "{this.state.bundledItem.entity.name}" endpoint from "{this.props.entity.name}"?
            </span>
          </TwoOptionModal>
        }
      </div>
    );
  }
}

export default CanvasElement(API);
