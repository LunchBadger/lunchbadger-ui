import React, {Component, PropTypes} from 'react';
import numeral from 'numeral';
import './PlanInfoTooltip.scss';

export default class PlanInfoTooltip extends Component {
  static propTypes = {
    forecast: PropTypes.object.isRequired,
    plan: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired
  };

  getNewPlanBase() {
    const {api} = this.props.forecast;
    const plans = api.plans;

    return plans.map((plan) => {
      const userCount = plan.getUsersCountAtDateIncludingUpgrades(this.props.date, api);

      return (
        <li key={plan.id}>
          {plan.name} - {numeral(userCount).format('0,0')}
        </li>
      );
    });
  }

  render() {
    return (
      <div className="plan-info-tooltip">
        <div className="plan-info-tooltip__holder">
          <a className="fa fa-info-circle plan-info-tooltip__icon"/>
          <div className="plan-info-tooltip__tip">
            <p className="plan-info-tooltip__paragraph">New user base:</p>
            <ul className="plan-info-tooltip__list">
              {this.getNewPlanBase()}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
