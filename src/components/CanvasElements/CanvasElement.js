import React, {Component, PropTypes} from 'react';
import './CanvasElement.scss';

export default (ComposedComponent) => {
  return class CanvasElement extends Component {
    static propTypes = {
      icon: PropTypes.string.isRequired,
      entity: PropTypes.object.isRequired
    };

    render() {
      return (
        <div className="canvas-element">
          <div className="canvas-element__inside">
            <div className="canvas-element__icon">
              <i className={`fa ${this.props.icon}`}/>
            </div>
            <ComposedComponent {...this.props} />
          </div>
        </div>
      );
    }
  }
}
