import React, {Component, PropTypes} from 'react';
import Pipeline from './Subelements/Pipeline';
import updateGateway from 'actions/CanvasElements/Gateway/update';
import addPipeline from 'actions/CanvasElements/Gateway/addPipeline';
import {notify} from 'react-notify-toast';
import classNames from 'classnames';

const Connection = LunchBadgerCore.stores.Connection;
const CanvasElement = LunchBadgerCore.components.CanvasElement;
const Input = LunchBadgerCore.components.Input;

class Gateway extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object,
    parent: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      hasConnection: null
    };
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.ready && !this.props.ready) {
      this._onDeploy();
    }

    if (nextState === null || this.state.hasConnection !== nextState.hasConnection) {
      const hasConnection = nextProps.entity.pipelines.some((publicEndpoint) => {
        return Connection.getConnectionsForTarget(publicEndpoint.id).length;
      });

      if (hasConnection) {
        this.setState({hasConnection: true});
      } else {
        this.setState({hasConnection: false});
      }
    }
  }

  renderPipelines() {
    return this.props.entity.pipelines.map((pipeline) => {
      return (
        <div key={pipeline.id} className="canvas-element__sub-element">
          <Pipeline paper={this.props.paper} rootPath={this.props.entity.rootPath} entity={pipeline}/>
        </div>
      );
    });
  }

  update(model) {
    updateGateway(this.props.entity.id, model);
  }

  onAddPipeline(name) {
    addPipeline(this.props.entity, name);
  }

  _onDeploy() {
    notify.show('Gateway successfully deployed', 'success');
    this.props.parent.triggerElementAutofocus();
  }

  render() {
    const elementClass = classNames({
      'has-connection': this.state.hasConnection
    });

    return (
      <div className={elementClass}>
        <div className="canvas-element__properties">
          <div className="canvas-element__properties__title">Properties</div>

          <div className="canvas-element__properties__table">
            <div className="canvas-element__properties__property">
              <div className="canvas-element__properties__property-title">Root path</div>
              <div className="canvas-element__properties__property-value">
              <span className="hide-while-edit">
                {this.props.entity.rootPath}
              </span>

                <Input className="canvas-element__input canvas-element__input--property editable-only"
                       name="rootPath"
                       value={this.props.entity.rootPath}/>
              </div>
            </div>
          </div>
        </div>
        <div className="canvas-element__sub-elements">
          <div className="canvas-element__sub-elements__title">
            Pipelines
            <i onClick={() => this.onAddPipeline('Pipeline')} className="canvas-element__add fa fa-plus"/>
          </div>
          <div>{this.renderPipelines()}</div>
        </div>
      </div>
    );
  }
}

export default CanvasElement(Gateway);
