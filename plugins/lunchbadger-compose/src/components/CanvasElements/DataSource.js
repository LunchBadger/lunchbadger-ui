import React, {Component, PropTypes} from 'react';
import cs from 'classnames';
import updateDataSource from '../../actions/CanvasElements/DataSource/update';
import removeDataSource from '../../actions/CanvasElements/DataSource/remove';

const CanvasElement = LunchBadgerCore.components.CanvasElement;
const Input = LunchBadgerCore.components.Input;
const Port = LunchBadgerCore.components.Port;

class DataSource extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object
  };

  static contextTypes = {
    projectService: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  update(model) {
    const validations = this.validate(model);
    if (validations.isValid) {
      updateDataSource(this.context.projectService, this.props.entity.id, model);
    }
    return validations;
  }

  validate = (model) => {
    const validations = {
      isValid: true,
      data: {},
    }
    const messages = {
      empty: 'This field cannot be empty',
    }
    if (model.name === '') validations.data.name = messages.empty;
    if (model.url === '') validations.data.url = messages.empty;
    if (model.database === '') validations.data.database = messages.empty;
    if (model.username === '') validations.data.username = messages.empty;
    if (model.password === '') validations.data.password = messages.empty;
    if (Object.keys(validations.data).length > 0) validations.isValid = false;
    return validations;
  }

  handleFieldChange = field => (evt) => {
    if (typeof this.props.onFieldUpdate === 'function') {
      this.props.onFieldUpdate(field, evt.target.value);
    }
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

  removeEntity() {
    removeDataSource(this.context.projectService, this.props.entity);
  }

  render() {
    const {entity, validations: {data}} = this.props;
    return (
      <div>
        <div>
          {this.renderPorts()}
        </div>
        <div className="canvas-element__properties">
          <div className="canvas-element__properties__table">
            <div className={cs('canvas-element__properties__property', {['invalid']: data.url})}>
              <div className="canvas-element__properties__property-title">URL</div>
              <div className="canvas-element__properties__property-value">
                <span className="hide-while-edit">
                  {entity.url || 'Enter URL here'}
                </span>
                <Input className="canvas-element__input canvas-element__input--property editable-only"
                       value={entity.url}
                       placeholder="Enter URL here"
                       name="url"
                       handleBlur={this.handleFieldChange('url')}
                />
              </div>
            </div>

            <div className={cs('canvas-element__properties__property', {['invalid']: data.database})}>
              <div className="canvas-element__properties__property-title">Database</div>
              <div className="canvas-element__properties__property-value">
                <span className="hide-while-edit">
                  {entity.database || 'Enter database here'}
                </span>
                <Input className="canvas-element__input canvas-element__input--property editable-only"
                       value={entity.database}
                       placeholder="Enter database here"
                       name="database"
                       handleBlur={this.handleFieldChange('database')}
                />
              </div>
            </div>

            <div className={cs('canvas-element__properties__property', {['invalid']: data.username})}>
              <div className="canvas-element__properties__property-title">Username</div>
              <div className="canvas-element__properties__property-value">
                <span className="hide-while-edit">
                  {entity.username || 'Enter username here'}
                </span>
                <Input className="canvas-element__input canvas-element__input--property editable-only"
                       value={entity.username}
                       placeholder="Enter username here"
                       name="username"
                       handleBlur={this.handleFieldChange('username')}
                />
              </div>
            </div>

            <div className={cs('canvas-element__properties__property', {['invalid']: data.password})}>
              <div className="canvas-element__properties__property-title">Password</div>
              <div className="canvas-element__properties__property-value">
                <span className="hide-while-edit">
                  {entity.password.length > 0 ? '•'.repeat(entity.password.length) : 'Enter password here'}
                </span>
                <Input className="canvas-element__input canvas-element__input--property editable-only"
                       value={entity.password}
                       placeholder="Enter password here"
                       type="password"
                       name="password"
                       handleBlur={this.handleFieldChange('password')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CanvasElement(DataSource);
