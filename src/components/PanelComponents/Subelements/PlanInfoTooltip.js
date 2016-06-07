import React, {Component, PropTypes} from 'react';
import ReactTooltip from 'react-tooltip';
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
        <a data-tip data-for={`plan-tooltip-${this.props.plan.id}`} className="fa fa-info-circle plan-info-tooltip__icon"/>

        <ReactTooltip place="right" type="dark" effect="solid" id={`plan-tooltip-${this.props.plan.id}`}>
          <p className="plan-info-tooltip__paragraph">New user base:</p>
          <ul className="plan-info-tooltip__list">
            {this.getNewPlanBase()}
          </ul>
        </ReactTooltip>
      </div>
    );
  }
}
