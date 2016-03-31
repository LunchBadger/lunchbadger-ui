import React, {Component, PropTypes} from 'react';
import './Port.scss';

export default class Port extends Component {
  static propTypes = {
    way: PropTypes.oneOf(['in', 'out']).isRequired,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={`port ${this.props.className}`}>
        <div className="port__inside">
          <i className="port__icon fa fa-arrow-right"/>
        </div>
      </div>
    );
  }
}
