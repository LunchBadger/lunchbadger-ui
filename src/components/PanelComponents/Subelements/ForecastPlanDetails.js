import React, {Component, PropTypes} from 'react';
import addTier from 'actions/APIForecast/addTier';
import Tier from './Tier';
import _ from 'lodash';
import moment from 'moment';
import classNames from 'classnames';

export default class ForecastPlanDetails extends Component {
  static propTypes = {
    plan: PropTypes.object,
    date: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      plan: props.plan
    }
  }

  renderTiers() {
    let index = 0;

    return this.state.plan && this.state.plan.tiers.map((tier) => {
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
      </div>
    );
  }
}
