import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import selector from '../../../utils/selectorApiEndpoint';

const BaseDetails = LunchBadgerCore.components.BaseDetails;
const Input = LunchBadgerCore.components.Input;
const CollapsableDetails = LunchBadgerCore.components.CollapsableDetails;

class ApiEndpointDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      path: props.entity.path
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.entity !== nextProps.entity) {
      this.setState({path: nextProps.entity.path});
    }
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

export default connect(selector)(BaseDetails(ApiEndpointDetails));
