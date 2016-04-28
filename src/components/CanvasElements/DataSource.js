import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import Port from './Port';
import './CanvasElement.scss';
import updateDataSource from 'actions/CanvasElements/DataSource/update';
import Input from 'components/Generics/Form/Input';

class DataSource extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  update(model) {
    updateDataSource(this.props.entity.id, model);
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
    const {entity} = this.props;

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
                  {entity.url}
                </span>

                <Input className="canvas-element__input canvas-element__input--property editable-only"
                       value={entity.url}
                       name="url"/>
              </div>
            </div>

            <div className="canvas-element__properties__property">
              <div className="canvas-element__properties__property-title">Schema</div>
              <div className="canvas-element__properties__property-value">
                <span className="hide-while-edit">
                  {entity.schema}
                </span>

                <Input className="canvas-element__input canvas-element__input--property editable-only"
                       value={entity.schema}
                       name="schema"/>
              </div>
            </div>

            <div className="canvas-element__properties__property">
              <div className="canvas-element__properties__property-title">Username</div>
              <div className="canvas-element__properties__property-value">
                <span className="hide-while-edit">
                  {entity.username}
                </span>

                <Input className="canvas-element__input canvas-element__input--property editable-only"
                       value={entity.username}
                       name="username"/>
              </div>
            </div>

            <div className="canvas-element__properties__property">
              <div className="canvas-element__properties__property-title">Password</div>
              <div className="canvas-element__properties__property-value">
                <span className="hide-while-edit">
                  {entity.password}
                </span>

                <Input className="canvas-element__input canvas-element__input--property editable-only"
                       value={entity.password}
                       name="password"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CanvasElement(DataSource);
