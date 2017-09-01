import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './PublicEndpoint.scss';

const Port = LunchBadgerCore.components.Port;

export default class PublicEndpoint extends Component {
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
      <div className="public-endpoint__info">
        {this.renderPorts()}
        <div className="public-endpoint__icon">
          <i className="fa fa-globe"/>
        </div>
        <div className="public-endpoint__name">
          {this.props.entity.name}
        </div>
      </div>
    );
  }
}
