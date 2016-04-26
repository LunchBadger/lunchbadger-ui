import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import Port from './Port';
import './CanvasElement.scss';
import updateDataSource from '../../actions/CanvasElements/DataSource/update';

class DataSource extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object,
    name: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    const {entity} = props;

    this.state = {
      url: entity.url,
      schema: entity.schema,
      username: entity.username,
      password: entity.password
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      url: props.entity.url,
      schema: props.entity.schema,
      username: props.entity.username,
      password: props.entity.password
    });
  }

  update() {
    updateDataSource(this.props.entity.id, {
      name: this.props.name,
      url: this.state.url,
      schema: this.state.schema,
      username: this.state.username,
      password: this.state.password
    });
  }

  updateProperty(event, key) {
    const {target} = event;
    const newState = {};

    newState[key] = target.value;

    this.setState(newState);
  }

  renderPorts() {
    return this.props.entity.ports.map((port) => {

      return (
        <Port key={`port-${port.portType}-${port.id}`}
              paper={this.props.paper}
              way={port.portType}
              elementId={this.props.entity.id}
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

                <input className="canvas-element__input canvas-element__input--property editable-only"
                       value={this.state.url}
                       type="text"
                       onChange={(event) => this.updateProperty(event, 'url')}/>
              </div>
            </div>

            <div className="canvas-element__properties__property">
              <div className="canvas-element__properties__property-title">Schema</div>
              <div className="canvas-element__properties__property-value">
              <span className="hide-while-edit">
                {this.props.entity.schema}
              </span>

                <input className="canvas-element__input canvas-element__input--property editable-only"
                       value={this.state.schema}
                       type="text"
                       onChange={(event) => this.updateProperty(event, 'schema')}/>
              </div>
            </div>

            <div className="canvas-element__properties__property">
              <div className="canvas-element__properties__property-title">Username</div>
              <div className="canvas-element__properties__property-value">
              <span className="hide-while-edit">
                {this.props.entity.username}
              </span>

                <input className="canvas-element__input canvas-element__input--property editable-only"
                       value={this.state.username}
                       type="text"
                       onChange={(event) => this.updateProperty(event, 'username')}/>
              </div>
            </div>

            <div className="canvas-element__properties__property">
              <div className="canvas-element__properties__property-title">Password</div>
              <div className="canvas-element__properties__property-value">
              <span className="hide-while-edit">
                {this.props.entity.password}
              </span>

                <input className="canvas-element__input canvas-element__input--property editable-only"
                       value={this.state.password}
                       type="text"
                       onChange={(event) => this.updateProperty(event, 'password')}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CanvasElement(DataSource);
