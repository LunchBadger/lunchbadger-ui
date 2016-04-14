import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import Port from './Port';
import './CanvasElement.scss';
import updatePublicEndpoint from '../../actions/PublicEndpoint/update';

class PublicEndpoint extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object
  };

  onNameUpdate(name) {
    updatePublicEndpoint(this.props.entity.id, {name});
  }

  render() {
    return (
      <div>
        <Port way="in"
              paper={this.props.paper}
              className="canvas-element__port canvas-element__port--in"/>
      </div>
    );
  }
}

export default CanvasElement(PublicEndpoint);
