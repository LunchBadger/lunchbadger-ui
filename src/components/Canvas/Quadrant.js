import React, {Component, PropTypes} from 'react';
import './Quadrant.scss';

export default class Quadrant extends Component {
  render() {
    return (
      <div className="quadrant">
        <div className="quadrant__title">{this.props.title}</div>
        <div className="quadrant__body">
          
        </div>
      </div>
    );
  }
}

Quadrant.propTypes = {
  title: PropTypes.string.isRequired,
};
