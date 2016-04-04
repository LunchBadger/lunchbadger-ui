import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import Port from './Port';
import './CanvasElement.scss';
import updateModel from '../../actions/Model/update';

class Model extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  onNameUpdate(name) {
    updateModel(this.props.entity.id, {name});
  }

  render() {
    return (
      <div>
        <Port way="in" className="canvas-element__port canvas-element__port--in"/>
        <Port way="out" className="canvas-element__port canvas-element__port--out"/>
      </div>
    );
  }
}

export default CanvasElement(Model);
