import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import Port from './Port';
import './CanvasElement.scss';

class Gateway extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div>
        <div className="canvas-element__title">
          {this.props.entity.name}
        </div>
        <Port way="in" className="canvas-element__port canvas-element__port--in"/>
        <Port way="out" className="canvas-element__port canvas-element__port--out"/>
      </div>
    );
  }
}

export default CanvasElement(Gateway);
