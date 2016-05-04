import React, {Component, PropTypes} from 'react';
import Port from './Port';
import updatePublicEndpoint from 'actions/CanvasElements/PublicEndpoint/update';
import {findDOMNode} from 'react-dom';
import Connection from 'stores/Connection';
import _ from 'lodash';

const CanvasElement = LBCore.components.CanvasElement;
const Input = LBCore.components.Input;

class PublicEndpoint extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._checkAndReconnectElementIfRequired();
  }

  _checkAndReconnectElementIfRequired() {
    const connections = Connection.getConnectionsForTarget(this.props.entity.id);

    _.forEach(connections, (connection) => {
      if (connection.info && connection.info.connection) {
        this.props.paper.detach(connection.info.connection);
      }

      this.props.paper.connect({
        source: connection.info.source,
        target: findDOMNode(this.refs['port-in'])
      });
    });
  }

  update(model) {
    updatePublicEndpoint(this.props.entity.id, model);
  }

  renderPorts() {
    return this.props.entity.ports.map((port) => {
      return (
        <Port key={`port-${port.portType}-${port.id}`}
              paper={this.props.paper}
              way={port.portType}
              elementId={this.props.entity.id}
              className={`port-${this.props.entity.constructor.type} port-${port.portGroup}`}
              ref={`port-${port.portType}`}
              scope={port.portGroup}/>
      );
    });
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

                <Input className="canvas-element__input canvas-element__input--property editable-only"
                       value={this.props.entity.url}
                       name="url"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CanvasElement(PublicEndpoint);
