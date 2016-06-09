import React, {Component, PropTypes} from 'react';
import './Tier.scss';
import numeral from 'numeral';

export default class Tier extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    tier: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const {tier} = props;

    this.state = {
      type: tier.type,
      conditionFrom: tier.conditionFrom,
      conditionTo: tier.conditionTo,
      value: tier.value
    }
  }

  renderCondition() {
    const {conditionFrom, conditionTo, type} = this.state;
    const conditionUsers = conditionTo > 0 ? `${conditionFrom} - ${conditionTo}` : `${conditionFrom}+`;
    let condition;

    switch (type) {
      case 'percentage':
        condition = '>$0 total transactions / month';
        break;
      case 'throttle':
        condition = `${conditionUsers} total calls / hour`;
        break;
      case 'fixed':
      default:
        condition = `${conditionUsers} total calls / hour`
    }

    return (
      <span>{condition}</span>
    );
  }

  renderCharge() {
    const {value, type} = this.state;
    let charge;

    switch (type) {
      case 'percentage':
        charge = `Charge ${numeral(value).format('0.[0000]')}% of total $`;
        break;
      case 'throttle':
        charge = `Throttle to ${numeral(value).format('0.[0]a')} per hour`;
        break;
      case 'fixed':
      default:
        charge = `Charge ${numeral(value).format('$0.[0000]')} per call`
    }

    return (
      <span>{charge}</span>
    );
  }

  render() {
    return (
      <tr>
        <td>
          Tier {this.props.index}
        </td>
        <td>
          {this.renderCondition()}
        </td>
        <td>
          {this.renderCharge()}
        </td>
      </tr>
    )
  }
}
