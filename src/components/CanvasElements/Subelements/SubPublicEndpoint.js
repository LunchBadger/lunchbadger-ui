import React, {Component, PropTypes} from 'react';
import './PublicEndpoint.scss';

const Port = LunchBadgerCore.components.Port;

export default class PublicEndpoint extends Component {
  static propTypes = {
    parent: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    id: PropTypes.any.isRequired,
    paper: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  renderPorts() {
    return this.props.entity.ports.map((port) => {
      return (
        <Port key={`port-${port.portType}-${port.id}`}
              paper={this.props.paper}
              way={port.portType}
              middle={true}
              elementId={`${this.props.entity.id}`}
              ref={`port-${port.portType}`}
              scope={port.portGroup}/>
      );
    });
  }

  render() {
    return (
      <div className="public-endpoint public-endpoint--bundled">
        <div className="public-endpoint__info">
          <div className="public-endpoint__icon">
            <i className="fa fa-globe"/>
          </div>
          <div className="public-endpoint__name">
            {this.props.entity.name}
          </div>

          {this.renderPorts()}
        </div>
      </div>
    );
  }
}
