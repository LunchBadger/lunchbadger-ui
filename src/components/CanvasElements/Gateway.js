import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import Pipeline from './Subelements/Pipeline';
import './CanvasElement.scss';
import updateGateway from '../../actions/Gateway/update';
import addPipeline from '../../actions/Gateway/addPipeline';
import {notify} from 'react-notify-toast';

class Gateway extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object,
    parent: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      deployed: false
    };

    this.onDeploy = (nextProps) => {
      if (nextProps.entity.ready === true && this.state.deployed === false) {
        this.setState({deployed: true});
        notify.show('Gateway successfully deployed', 'success');
        this.props.parent.triggerElementAutofocus();

        delete this.onDeploy;
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.onDeploy) {
      this.onDeploy(nextProps);
    }
  }

  renderPipelines() {
    return this.props.entity.pipelines.map((pipeline) => {
      return (
        <div key={pipeline.id} className="canvas-element__sub-element">
          <Pipeline paper={this.props.paper} entity={pipeline}/>
        </div>
      );
    });
  }

  update() {
    updateGateway(this.props.entity.id, {
      name: this.props.name
    });
  }

  onAddPipeline(name) {
    addPipeline(this.props.entity, name);
  }

  render() {
    return (
      <div>
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
