import React, {Component, PropTypes} from 'react';
import addTier from 'actions/APIForecast/addTier';
import Tier from './Tier';

export default class ForecastPlanDetails extends Component {
  static propTypes = {
    plan: PropTypes.object.isRequired
  };

  renderTiers() {
    return this.props.plan.tiers.map((tier, index) => {
      return (
        <Tier key={tier.id}
              index={index + 1}
              tier={tier}/>
      );
    });
  }

  addTier(event) {
    // addTier(this.props.plan, {
    //   name: 'Tier x',
    //   totals: 'sth',
    //   charge: 0.0
    // });

    event.stopPropagation();
  }

  render() {
    return (
      <div className="base-plan__tiers">
        <div className="base-plan__tiers__caption">
          Tiers

          <a className="base-plan__add-tier" onClick={this.addTier.bind(this)}>
            <i className="fa fa-plus"/>
          </a>
        </div>
        <table className="base-plan__tiers__table">
          <tbody>
          {this.renderTiers()}
          </tbody>
        </table>
      </div>
    );
  }
}
