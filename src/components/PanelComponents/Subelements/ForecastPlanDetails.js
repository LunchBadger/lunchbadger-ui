import React, {Component, PropTypes} from 'react';
import addTier from 'actions/APIForecast/addTier';
import Tier from './Tier';
import _ from 'lodash';
import moment from 'moment';

export default class ForecastPlanDetails extends Component {
  static propTypes = {
    plan: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired
  };

  renderTiers() {
    let index = 0;

    return this.props.plan.tiers.map((tier) => {
      const tierDetail = _.find(tier.details, (details) => {
        return details.date === this.props.date;
      });

      if (tierDetail) {
        index = index + 1;

        return (
          <Tier key={tier.id}
                date={this.props.date}
                index={index}
                detail={tierDetail}
                tier={tier}/>
        );
      }

      return null;
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
    const date = moment(this.props.date, 'M/YYYY');

    return (
      <div className="base-plan__tiers">
        <div className="base-plan__tiers__caption">
          Tiers

          {
            date.isAfter(moment(), 'month') && (
              <a className="base-plan__add-tier" onClick={this.addTier.bind(this)}>
                <i className="fa fa-plus"/>
              </a>
            )
          }
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
