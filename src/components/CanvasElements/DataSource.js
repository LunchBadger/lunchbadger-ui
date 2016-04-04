import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import Port from './Port';
import './CanvasElement.scss';
import updateDataSource from '../../actions/DataSource/update';

class DataSource extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  onNameUpdate(name) {
    updateDataSource(this.props.entity.id, {name});
  }

  render() {
    return (
      <div>
        <Port way="out" className="canvas-element__port canvas-element__port--out"/>
      </div>
    );
  }
}

export default CanvasElement(DataSource);
