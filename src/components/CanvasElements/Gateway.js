import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import './CanvasElement.scss';

class Gateway extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <div className="canvas-element__title">
          {this.props.entity.name}
        </div>
      </div>
    );
  }
}

export default CanvasElement(Gateway);
