import React, {Component, PropTypes} from 'react';
import Port from '../Port';
import './Pipeline.scss';

export default class Pipeline extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  render() {
    return (
      <div className="pipeline pipeline--opened">
        <div className="pipeline__details">
          <div className="pipeline__icon">
            <i className="fa fa-inbox"/>
          </div>
          <div className="pipeline__name">
            {this.props.entity.name}
          </div>
        </div>
        <Port way="in" className="canvas-element__port canvas-element__port--in"/>
        <Port way="out" className="canvas-element__port canvas-element__port--out"/>
      </div>
    );
  }
}
