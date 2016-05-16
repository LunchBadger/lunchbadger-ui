import React, {Component, PropTypes} from 'react';
import './BaseCreature.scss';
import Tier from './Tier';
import CreatureIcon from './CreatureIcon';
import classNames from 'classnames';
import addTier from 'actions/API/addTier';
import {DropTarget} from 'react-dnd';
import addUpgrade from 'actions/API/addUpgrade';

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

@DropTarget('creatureElement', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class BaseCreature extends Component {
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
      name: 'tier x',
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
      <div className={`base-creature ${elementClass}`}
           onClick={this.toggleExpanded.bind(this)}>
        <CreatureIcon icon={this.props.icon} entity={this.props.entity}/>
        <div className="base-creature__tiers">
          <table>
            <caption>Tiers <a className="base-creature__add-tier" onClick={this.addTier.bind(this)}><i className="fa fa-plus"></i></a></caption>
            <tbody>
              {this.renderTiers()}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
