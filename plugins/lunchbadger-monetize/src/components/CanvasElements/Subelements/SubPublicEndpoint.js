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
    let APIsOffsetTop = 0;
    let stopLoop = false;
    Object.keys(this.props.APIsOpened).forEach((key, index) => {
      if (!stopLoop) {
        if (key === this.props.APIId && this.props.APIsOpened[key]) {
          APIsOffsetTop += 54 + this.props.index * 26;
        }
      }
      if (key === this.props.APIId) {
        stopLoop = true;
      }
      if (stopLoop) return;
      if (this.props.APIsOpened[key]) {
        APIsOffsetTop += 25 + this.props.APIsPublicEndpoints[key] * 26;
      }
    });
    return this.props.entity.ports.map((port) => {
      return (
        <Port key={`port-${port.portType}-${port.id}`}
              paper={this.props.paper}
              way={port.portType}
              middle={true}
              elementId={`${this.props.entity.id}`}
              ref={`port-${port.portType}`}
              scope={port.portGroup}
              offsetTop={103 + APIsOffsetTop + this.props.indexAPI * 52}
        />
      );
    });
  }

  render() {
    return (
      <div className="public-endpoint__info">
        <div className="public-endpoint__icon">
          <i className="fa fa-globe"/>
        </div>
        <div className="public-endpoint__name">
          {this.props.entity.name}
        </div>

        {this.renderPorts()}
      </div>
    );
  }
}
