import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import Port from './Port';
import './CanvasElement.scss';
import updatePublicEndpoint from '../../actions/CanvasElements/PublicEndpoint/update';
import {findDOMNode} from 'react-dom';
import Connection from 'stores/Connection';
import _ from 'lodash';

class PublicEndpoint extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object,
    name: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      url: this.props.entity.url
    };
  }

  componentDidMount() {
    this._checkAndReconnectElementIfRequired();
  }

  _checkAndReconnectElementIfRequired() {
    const connections = Connection.getConnectionsForTarget(this.props.entity.id);

    _.forEach(connections, (connection) => {
      this.props.paper.connect({
        source: connection.info.source,
        target: findDOMNode(this.refs['port-in'])
      });
    });
  }

  update() {
    updatePublicEndpoint(this.props.entity.id, {
      name: this.props.name,
      url: this.state.url
    });
  }

  renderPorts() {
    return this.props.entity.ports.map((port) => {
      return (
        <Port key={`port-${port.portType}-${port.id}`}
              paper={this.props.paper}
              way={port.portType}
              elementId={this.props.entity.id}
              className={`port-${port.portType} port-${this.props.entity.constructor.type} port-${port.portGroup}`}
              ref={`port-${port.portType}`}
              scope={port.portGroup}/>
      );
    });
  }

  updateURL(evt) {
    this.setState({url: evt.target.value});
  }

  render() {
    return (
      <div>
        <div>
          {this.renderPorts()}
        </div>
        <div className="canvas-element__properties">
          <div className="canvas-element__properties__title">Properties</div>

          <div className="canvas-element__properties__table">
            <div className="canvas-element__properties__property">
              <div className="canvas-element__properties__property-title">URL</div>
              <div className="canvas-element__properties__property-value">
              <span className="hide-while-edit">
                {this.props.entity.url}
              </span>

                <input className="canvas-element__input canvas-element__input--property editable-only"
                       value={this.state.url}
                       onChange={this.updateURL.bind(this)}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CanvasElement(PublicEndpoint);
