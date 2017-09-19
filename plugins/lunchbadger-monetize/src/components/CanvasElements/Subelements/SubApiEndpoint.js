import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './ApiEndpoint.scss';

const Port = LunchBadgerCore.components.Port;

export default class ApiEndpoint extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
  };

  renderPorts() {
    return this.props.entity.ports.map((port) => {
      return (
        <Port
          key={`port-${port.portType}-${port.id}`}
          way={port.portType}
          middle={true}
          elementId={port.id}
          scope={port.portGroup}
        />
      );
    });
  }

  render() {
    return (
      <div className="api-endpoint__info">
        {this.renderPorts()}
        <div className="api-endpoint__icon">
          <i className="fa fa-globe"/>
        </div>
        <div className="api-endpoint__name">
          {this.props.entity.name}
        </div>
      </div>
    );
  }
}
