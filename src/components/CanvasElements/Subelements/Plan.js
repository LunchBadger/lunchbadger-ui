import React, {Component, PropTypes} from 'react';
import './Plan.scss';

export default class Plan extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="plan">
        <div className="plan__info">
          <div className="plan__icon">
            <i className="fa fa-file-o"/>
          </div>
          <div className="plan__name">
            {this.props.entity.name}
          </div>
        </div>
      </div>
    );
  }
}
