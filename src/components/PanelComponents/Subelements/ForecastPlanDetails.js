import React, {Component, PropTypes} from 'react';
import addTier from 'actions/APIForecast/addTier';
import Tier from './Tier';
import classNames from 'classnames';

export default class ForecastPlanDetails extends Component {
  static propTypes = {
    plan: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      plan: props.plan
    }
  }

  renderTiers() {
    return this.state.plan && this.state.plan.tiers.map((tier, index) => {
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

  componentWillReceiveProps(nextProps) {
    clearTimeout(this.animationTimeout);

    if (nextProps.plan === null) {
      this.animationTimeout = setTimeout(() => this.setState({plan: nextProps.plan}), 700);
    } else {
      this.setState({plan: nextProps.plan});
    }
  }

  render() {
    const tiersClass = classNames({
      'base-plan__tiers': true,
      'base-plan__tiers--opened': this.props.plan !== null
    });

    return (
      <div className={tiersClass}>
        <div className="base-plan__tiers__inside">
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
      </div>
    );
  }
}
