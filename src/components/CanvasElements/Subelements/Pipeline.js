import React, {Component, PropTypes} from 'react';
import Port from '../Port';
import './Pipeline.scss';

export default class Pipeline extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  render() {
    return (
      <div className="pipeline">
        <div className="pipeline__name">{this.props.entity.name}</div>
        <Port way="in" className="canvas-element__port canvas-element__port--in"/>
        <Port way="out" className="canvas-element__port canvas-element__port--out"/>
      </div>
    );
  }
}
