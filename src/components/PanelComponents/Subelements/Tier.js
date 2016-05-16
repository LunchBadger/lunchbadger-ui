import React, {Component, PropTypes} from 'react';
import './Tier.scss';

export default class Tier extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    totals: PropTypes.string.isRequired,
    charge: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <tr>
        <td>{this.props.name}</td>
        <td>{`${this.props.totals} 'calls / hour'`}</td>
        <td>{`'Charge $'${this.props.charge}' per call'`}</td>
      </tr>
    )
  }
}
