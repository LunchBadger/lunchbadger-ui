import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import Port from './Port';
import './CanvasElement.scss';
import updatePublicEndpoint from '../../actions/PublicEndpoint/update';

class PublicEndpoint extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  onNameUpdate(name) {
    updatePublicEndpoint(this.props.entity.id, {name});
  }

  render() {
    return (
      <div>
        <Port way="in" className="canvas-element__port canvas-element__port--in"/>
      </div>
    );
  }
}

export default CanvasElement(PublicEndpoint);
