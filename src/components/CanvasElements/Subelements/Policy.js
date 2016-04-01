import React, {Component, PropTypes} from 'react';
import './Policy.scss';

export default class Policy extends Component {
  static propTypes = {
    policy: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="policy">
        <div className="policy__icon">
          <i className="fa fa-certificate"/>
        </div>
        <div className="policy__name">
          {this.props.policy.name}
        </div>
      </div>
    );
  }
}
