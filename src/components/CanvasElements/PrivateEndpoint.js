import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import Port from './Port';
import './CanvasElement.scss';
import updatePrivateEndpoint from '../../actions/PrivateEndpoint/update';

class PrivateEndpoint extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  onNameUpdate(name) {
    updatePrivateEndpoint(this.props.entity.id, {name});
  }

  render() {
    return (
      <div>
        <Port way="out" className="canvas-element__port canvas-element__port--out"/>
      </div>
    );
  }
}

export default CanvasElement(PrivateEndpoint);
