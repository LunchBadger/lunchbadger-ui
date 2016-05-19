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
      name: `Upgrade ${item.entity.name} to ${component.props.entity.name}`,
      value: 5425,
      percentage: 50
    });
  }
};

@DropTarget('planElement', boxTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class BasePlan extends Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    entity: PropTypes.object.isRequired,
    parent: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      hasDropped: false,
      expanded: false
    }
  }

  toggleExpanded() {
    this.setState({
      expanded: !this.state.expanded
    })
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
    return this.props.entity.tiers.map((tier) => {
      return (
        <Tier key={tier.id}
                      name={tier.name}
                      totals={tier.totals}
                      charge={tier.charge}/>
      )
    })
  }

  render() {
    const elementClass = classNames({
      expanded: this.state.expanded
    });
    const {connectDropTarget} = this.props;

    return connectDropTarget(
      <div className={`base-plan ${elementClass}`}
           onClick={this.toggleExpanded.bind(this)}>
        <PlanIcon icon={this.props.icon} entity={this.props.entity}/>
        <div className="base-plan__tiers">
          <table>
            <caption>Tiers <a className="base-plan__add-tier" onClick={this.addTier.bind(this)}><i className="fa fa-plus"></i></a></caption>
            <tbody>
              {this.renderTiers()}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
