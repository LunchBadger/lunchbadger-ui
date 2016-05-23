import React, {Component, PropTypes} from 'react';
import './Tier.scss';

export default class Tier extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    tier: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <tr>
        <td>Tier {this.props.index}</td>
      </tr>
    )
  }
}
