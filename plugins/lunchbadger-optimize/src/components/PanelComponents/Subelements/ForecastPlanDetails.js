import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import {addTier} from '../../../reduxActions/forecasts';
import Tier from './Tier';

export default class ForecastPlanDetails extends Component {
  static propTypes = {
    plan: PropTypes.object,
    date: PropTypes.string.isRequired,
    forecastId: PropTypes.string,
  };

  static contextTypes = {
    store: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      plan: props.plan,
    }
  }

  renderTiers() {
    const {date, forecastId} = this.props;
    const {plan} = this.state;
    let index = 0;
    return plan && plan.tiers.map((tier) => {
      const tierDetail = _.find(tier.details, (details) => {
        return details.date === date;
      });
      if (tierDetail) {
        index = index + 1;
        return (
          <Tier
            key={tier.id}
            plan={plan}
            date={date}
            index={index}
            detail={tierDetail}
            tier={tier}
            forecastId={forecastId}
          />
        );
      }
      return null;
    });
  }

  addTier = (event) => {
    const {plan, date, forecastId} = this.props;
    this.context.store.dispatch(addTier(forecastId, plan, date));
    event.stopPropagation();
  }

  componentWillReceiveProps(nextProps) {
    clearTimeout(this.animationTimeout);
    if (nextProps.plan === null) {
      this.animationTimeout = setTimeout(() => this.setState({plan: nextProps.plan}), 700);
    } else {
      this.setState({plan: nextProps.plan});
    }
  }

  render() {
    const date = moment(this.props.date, 'M/YYYY');
    const tiersClass = classNames({
      'base-plan__tiers': true,
      'base-plan__tiers--opened': this.props.plan !== null
    });
    return (
      <div className={tiersClass}>
        <div className="base-plan__tiers__inside">
          <div className="base-plan__tiers__caption">
            Tiers
            {date.isAfter(moment(), 'month') && (
              <a className="base-plan__add-tier" onClick={this.addTier}>
                <i className="fa fa-plus"/>
              </a>
            )}
        </div>
        <table className="base-plan__tiers__table">
          <tbody>
            {this.renderTiers()}
          </tbody>
        </table>
          </div>
      </div>
    );
  }
}
