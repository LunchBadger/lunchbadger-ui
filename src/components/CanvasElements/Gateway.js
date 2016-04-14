import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import Pipeline from './Subelements/Pipeline';
import './CanvasElement.scss';
import updateGateway from '../../actions/Gateway/update';
import addPipeline from '../../actions/Gateway/addPipeline';

class Gateway extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object
  };

  constructor(props) {
    super(props);
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

  onNameUpdate(name) {
    updateGateway(this.props.entity.id, {name});
  }

  onAddPipeline(name) {
    addPipeline(this.props.entity, name);
  }

  render() {
    return (
      <div>
        <div className="canvas-element__sub-elements">
          <div className="canvas-element__sub-elements__title" onClick={() => this.onAddPipeline('dupa')}>Pipelines</div>
            <div>{this.renderPipelines()}</div>
        </div>
      </div>
    );
  }
}

export default CanvasElement(Gateway);
