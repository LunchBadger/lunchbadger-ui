import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import './CanvasElement.scss';

class DataSource extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="canvas-element__title">
        {this.props.entity.name}
      </div>
    );
  }
}

export default CanvasElement(DataSource);
