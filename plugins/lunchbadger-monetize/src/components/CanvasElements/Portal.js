import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {EntityProperties, EntitySubElements} from '../../../../lunchbadger-ui/src';
import classNames from 'classnames';
import {bundle, unbundle, rebundle} from '../../reduxActions/portals';
import _ from 'lodash';
import './API.scss';
import API from './Subelements/API';

const TwoOptionModal = LunchBadgerCore.components.TwoOptionModal;
const CanvasElement = LunchBadgerCore.components.CanvasElement;
const DraggableGroup = LunchBadgerCore.components.DraggableGroup;
const ElementsBundler = LunchBadgerCore.components.ElementsBundler;

class Portal extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object,
    parent: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object,
    paper: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      hasConnection: null,
      isShowingModal: false,
      isShowingModalMultiple: false,
      bundledItem: null,
      bundledItems: [],
    }
  }

  onRemove = () => this.props.entity.beforeRemove(this.context.paper.getInstance());

  handleFieldChange = field => (evt) => {
    if (typeof this.props.onFieldUpdate === 'function') {
      this.props.onFieldUpdate(field, evt.target.value);
    }
  }

  renderAPIs() {
    return this.props.entity.apis.map((endpoint) => {
      return (
        <API
          key={endpoint.id}
          parent={this.props.entity}
          id={endpoint.id}
          entity={endpoint}
          left={endpoint.left || 0}
          top={endpoint.top || 0}
          handleEndDrag={(item) => this._handleEndDrag(item)}
          hideSourceOnDrag={true}
        />
      );
    });
  }

  handleCloseModal = () => {
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
      bundledItems: this.props.currentlySelectedSubelements,
    });
  }

  bundle = (portal, api) => {
    const {store: {dispatch}} = this.context;
    dispatch(bundle(portal, api));
  }

  rebundle = (fromPortal, toPortal, api) => {
    const {store: {dispatch}} = this.context;
    dispatch(rebundle(fromPortal, toPortal, api));
  }

  unbundle = () => {
    const item = this.state.bundledItem;
    const {store: {dispatch}} = this.context;
    dispatch(unbundle(item.parent, item.entity));
  }

  unbundleMultiple = () => {
    const {store: {dispatch}} = this.context;
    this.state.bundledItems.forEach(item => dispatch(unbundle(this.props.entity, item)));
  }

  render() {
    const elementClass = classNames({
      'has-connection': this.state.hasConnection,
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
            icon="Api"
            entity={this.props.entity}
            groupEndDrag={() => this._handleMultipleUnbundle()}
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
            onAdd={this.bundle}
            onMove={this.rebundle}
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
            onClose={this.handleCloseModal}
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
        {this.state.isShowingModalMultiple && (
          <TwoOptionModal
            title="Unbundle Portal"
            confirmText="Yes"
            discardText="No"
            onClose={this.handleCloseModal}
            onSave={this.unbundleMultiple}
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

const selector = createSelector(
  state => state.states.currentlySelectedSubelements, // FIXME
  currentlySelectedSubelements => ({currentlySelectedSubelements}),
);

export default connect(selector, null, null, {withRef: true})(CanvasElement(Portal));
