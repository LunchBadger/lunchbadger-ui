import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import Pipeline from './Subelements/Pipeline';
import './CanvasElement.scss';
import updateGateway from '../../actions/Gateway/update';

class Gateway extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  renderPipelines() {
    return this.props.entity.pipelines.map((pipeline) => {
      return (
        <div key={pipeline.id} className="canvas-element__sub-element">
          <Pipeline entity={pipeline}/>
        </div>
      );
    });
  }

  onNameUpdate(name) {
    updateGateway(this.props.entity.id, {name});
  }

  render() {
    return (
      <div>
        <div className="canvas-element__sub-elements">
          <div className="canvas-element__sub-elements__title">Pipelines</div>
          {this.renderPipelines()}
        </div>
      </div>
    );
  }
}

export default CanvasElement(Gateway);
