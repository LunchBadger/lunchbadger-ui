import React, {Component, PropTypes} from 'react';
import removeTier from 'actions/APIForecast/removeTier';
import './Tier.scss';
import numeral from 'numeral';

export default class Tier extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    tier: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired,
    detail: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const {detail} = props;

    this.state = {
      type: detail.type,
      conditionFrom: detail.conditionFrom,
      conditionTo: detail.conditionTo,
      value: detail.value
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

    return condition;
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

    return charge;
  }

  _handleRemove() {
    removeTier(this.props.tier, this.props.date);
  }

  render() {
    return (
      <tr>
        <td className="tier__cell">
          Tier {this.props.index}
        </td>
        <td className="tier__cell">
          {this.renderCondition()}
        </td>
        <td className="tier__cell">
          {this.renderCharge()}
        </td>
        <td className="tier__action">
          <a className="tier__action__remove" onClick={this._handleRemove.bind(this)}>
            <i className="fa fa-times"/>
          </a>
        </td>
      </tr>
    )
  }
}
