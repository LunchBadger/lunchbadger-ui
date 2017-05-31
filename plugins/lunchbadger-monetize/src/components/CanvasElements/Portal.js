import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import cs from 'classnames';
import {EntityProperties, EntitySubElements} from '../../../../lunchbadger-ui/src';
import updatePortal from '../../actions/CanvasElements/Portal/update';
import unbundlePortal from '../../actions/CanvasElements/Portal/unbundle';
import moveBetweenPortals from '../../actions/CanvasElements/Portal/rebundle';
import classNames from 'classnames';
import bundlePortal from '../../actions/CanvasElements/Portal/bundle';
import {addSystemInformationMessage} from '../../../../lunchbadger-ui/src/actions';
import _ from 'lodash';
import './API.scss';
import API from './Subelements/API';

const toggleEdit = LunchBadgerCore.actions.toggleEdit;
const TwoOptionModal = LunchBadgerCore.components.TwoOptionModal;
const Connection = LunchBadgerCore.stores.Connection;
const CanvasElement = LunchBadgerCore.components.CanvasElement;
const DraggableGroup = LunchBadgerCore.components.DraggableGroup;
const Input = LunchBadgerCore.components.Input;
const ElementsBundler = LunchBadgerCore.components.ElementsBundler;

class Portal extends Component {
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
      isShowingModalMultiple: false,
      bundledItem: null,
      bundledItems: [],
      APIsOpened: {},
    }
  }

  componentDidMount() {
    this.props.paper.bind('connectionDetached', (info) => {
      this.previousConnection = info;
    });

    if (!this.props.ready) {
      toggleEdit(this.props.entity);
    }
    const APIsOpened = {...this.state.APIsOpened};
    this.props.entity.apis.forEach((item) => {
      APIsOpened[item.id] = true;
    });
    this.setState({APIsOpened});
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.ready && !this.props.ready) {
      this._onDeploy();
    }

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
    const APIsOpened = {...this.state.APIsOpened};
    let isChange = false;
    nextProps.entity.apis.forEach((item) => {
      if (typeof APIsOpened[item.id] === 'undefined') {
        APIsOpened[item.id] = true;
        isChange = true;
      }
    });
    if (isChange) {
      this.setState({APIsOpened});
    }
  }

  _onDeploy() {
    const dispatchRedux = LunchBadgerCore.dispatchRedux;
    dispatchRedux(addSystemInformationMessage({
      message: 'Portal successfully deployed',
      type: 'success'
    }));
    this.props.parent.triggerElementAutofocus();
  }

  update(model) {
    const validations = this.validate(model);
    if (validations.isValid) {
      updatePortal(this.props.entity.id, model);
    }
    return validations;
  }

  validate = (model) => {
    const validations = {
      isValid: true,
      data: {},
    }
    const messages = {
      empty: 'This field cannot be empty',
    }
    if (model.rootUrl === '') validations.data.rootUrl = messages.empty;
    if (Object.keys(validations.data).length > 0) validations.isValid = false;
    return validations;
  }

  handleFieldChange = field => (evt) => {
    if (typeof this.props.onFieldUpdate === 'function') {
      this.props.onFieldUpdate(field, evt.target.value);
    }
  }

  handleToggleAPIOpen = APIId => opened => {
    this.setState({APIsOpened: {...this.state.APIsOpened, [APIId]: opened}});
  }

  renderAPIs() {
    const APIsPublicEndpoints = {};
    this.props.entity.apis.forEach((endpoint) => {
      APIsPublicEndpoints[endpoint.id] = endpoint.publicEndpoints.length;
    });
    return this.props.entity.apis.map((endpoint, index) => {
      return (
        <API
          key={endpoint.id}
          {...this.props}
          parent={this.props.entity}
          key={endpoint.id}
          id={endpoint.id}
          entity={endpoint}
          paper={this.props.paper}
          left={endpoint.left}
          top={endpoint.top}
          handleEndDrag={(item) => this._handleEndDrag(item)}
          hideSourceOnDrag={true}
          onToggleOpen={this.handleToggleAPIOpen(endpoint.id)}
          APIsOpened={this.state.APIsOpened}
          index={index}
          APIsPublicEndpoints={APIsPublicEndpoints}
        />
      );
    });
  }

  _handleModalConfirm = () => {
    const item = this.state.bundledItem;
    unbundlePortal(item.parent, item.entity);
  }

  _handleClose = () => {
    this.setState({
      isShowingModal: false,
      isShowingModalMultiple: false
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

  _handleMultipleUnbundle() {
    this.setState({
      isShowingModalMultiple: true,
      bundledItems: this.props.appState.getStateKey('currentlySelectedSubelements')
    });
  }

  _handleModalConfirmMultiple = () => {
    this.state.bundledItems.forEach(item => unbundlePortal(this.props.entity, item));
  }

  render() {
    const elementClass = classNames({
      'has-connection': this.state.hasConnection
    });
    const {validations: {data}, entityDevelopment, onResetField} = this.props;
    const mainProperties = [
      {
        name: 'rootUrl',
        title: 'root URL',
        value: this.props.entity.rootUrl,
        invalid: data.rootUrl,
        onBlur: this.handleFieldChange('rootUrl'),
      },
    ];
    mainProperties.forEach((item, idx) => {
      mainProperties[idx].isDelta = item.value !== entityDevelopment[item.name];
      mainProperties[idx].onResetField = onResetField;
    });
    return (
      <div className={elementClass}>
        <EntityProperties properties={mainProperties} />
        <EntitySubElements title="APIs" main>
          <DraggableGroup
            iconClass="icon-icon-portal"
            entity={this.props.entity}
            groupEndDrag={() => this._handleMultipleUnbundle()}
            appState={this.props.appState}
          >
          {this.renderAPIs()}
          </DraggableGroup>
        </EntitySubElements>
        <div className="canvas-element__drop">
          <ElementsBundler
            {...this.props}
            canDropCheck={
              (item) => _.includes(this.props.entity.accept, item.entity.constructor.type)
              && !_.includes(this.props.entity.apis, item.entity)
            }
            onAddCheck={(item) => !_.includes(this.props.entity.apis, item.entity)}
            onAdd={bundlePortal}
            onMove={moveBetweenPortals}
            dropText={'Drag APIs here'}
            parent={this.props.parent}
            entity={this.props.entity}
          />
        </div>
        {this.state.isShowingModal && (
          <TwoOptionModal
            title="Unbundle Portal"
            confirmText="Yes"
            discardText="No"
            onClose={this._handleClose}
            onSave={this._handleModalConfirm}
          >
            <span>
              Are you sure you want to unbundle
              "{this.state.bundledItem.entity.name}"
              from
              "{this.props.entity.name}"?
            </span>
          </TwoOptionModal>
        )}
        {this.state.isShowingModalMultiple && (
          <TwoOptionModal
            title="Unbundle Portal"
            confirmText="Yes"
            discardText="No"
            onClose={this._handleClose}
            onSave={this._handleModalConfirmMultiple}
          >
            <span>
              Are you sure you want to unbundle
              "{this.state.bundledItems.map(entity => entity.name).join(', ')}"
              from
              "{this.props.entity.name}"?
            </span>
          </TwoOptionModal>
        )}
      </div>
    );
  }
}

export default CanvasElement(Portal);
