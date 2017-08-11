import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import selector from '../../../utils/selectorPublicEndpoint';
import _ from 'lodash';

const BaseDetails = LunchBadgerCore.components.BaseDetails;
const Input = LunchBadgerCore.components.Input;
const CollapsableDetails = LunchBadgerCore.components.CollapsableDetails;

class PublicEndpointDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  static contextTypes = {
    store: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      path: props.entity.path
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.entity.path !== nextProps.entity.path) {
      this.setState({path: nextProps.entity.path});
    }
  }

  update = async (model) => {
    const {entity} = this.props;
    const {store: {dispatch, getState}} = this.context;
    const plugins = getState().plugins;
    const onUpdate = plugins.onUpdate.PublicEndpoint;
    const updatedEntity = await dispatch(onUpdate(_.merge({}, entity, model)));
    const {coreActions} = LunchBadgerCore.utils;
    dispatch(coreActions.setCurrentElement(updatedEntity));
  }

  onPathChange = (event) => {
    this.setState({path: event.target.value});
  }

  render() {
    const {entity, gatewayPath} = this.props;
    const url = `${gatewayPath}${this.state.path}`;
    return (
      <CollapsableDetails title="Properties">
        <div className="details-panel__container details-panel__columns">
          <div className="details-panel__fieldset">
            <span className="details-panel__label">Path</span>
            <Input
              className="details-panel__input"
              value={entity.path}
              name="path"
              handleChange={this.onPathChange}
            />
          </div>
          <div className="details-panel__fieldset">
            <span className="details-panel__label">URL</span>
            <div className="details-panel__static-field">
              <a href={url} target="_blank">{url}</a>
            </div>
          </div>
        </div>
      </CollapsableDetails>
    )
  }
}

export default connect(selector)(BaseDetails(PublicEndpointDetails));
