import React, {Component, PropTypes} from 'react';
import QuadrantResizeHandle from './QuadrantResizeHandle';
import './Quadrant.scss';

export default class Quadrant extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quadrantWidth: '25'
    }
  }

  render() {
    return (
      <div className="quadrant" style={{width: `${this.state.quadrantWidth}%`}}>
        <div className="quadrant__title">{this.props.title}</div>
        <div className="quadrant__body">

        </div>
        {(() => {
          if (this.props.resizable) {
            return <QuadrantResizeHandle />;
          }
        })()}
      </div>
    );
  }
}

Quadrant.propTypes = {
  title: PropTypes.string.isRequired,
  resizable: PropTypes.bool,
};
