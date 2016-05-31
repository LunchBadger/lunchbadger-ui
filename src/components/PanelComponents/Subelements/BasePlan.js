import React, {Component, PropTypes} from 'react';
import './BasePlan.scss';
import Tier from './Tier';
import PlanIcon from './PlanIcon';
import classNames from 'classnames';
import addTier from 'actions/APIForecast/addTier';
import {DropTarget} from 'react-dnd';
import addUpgrade from 'actions/APIForecast/addUpgrade';

const boxTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    addUpgrade(component.props.parent, {
      fromPlan: item.entity,
      toPlan: component.props.entity,
      value: 10
    });
  }
};

@DropTarget('planElement', boxTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class BasePlan extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    parent: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired,
    currentPlan: PropTypes.bool,
    setCurrent: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      hasDropped: false
    }
  }

  addTier(event) {
    addTier(this.props.entity, {
       name: 'Tier x',
       totals: 'sth',
       charge: 0.0
     });

    event.stopPropagation();
  }

  renderTiers() {
    return this.props.entity.tiers.map((tier, index) => {
      return (
        <Tier key={tier.id}
              index={index + 1}
              tier={tier}/>
      )
    })
  }

  render() {
    const elementClass = classNames({
      expanded: this.props.currentPlan
    });
    const {connectDropTarget} = this.props;

    return connectDropTarget(
      <div className={`base-plan ${elementClass}`}
           onClick={() => this.props.setCurrent()}>
        <PlanIcon entity={this.props.entity}/>
        <div className="base-plan__tiers">
          <table>
            <caption>Tiers
              <a className="base-plan__add-tier" onClick={this.addTier.bind(this)}>
                <i className="fa fa-plus"/>
              </a>
            </caption>
            <tbody>
            {this.renderTiers()}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
