import React, {Component, PropTypes} from 'react';
import {DragSource} from 'react-dnd';
import classNames from 'classnames';
import './APIForecast.scss';
import removeAPIForecast from 'actions/API/remove';
import BasePlan from 'BasePlan.js';
import addPlan from 'addPlan.js';
import UpgradeSlider from 'components/PanelComponents/Subelements/UpgradeSlider';
import DateSlider from 'rc-slider';
import 'rc-slider/assets/index.css';

const boxSource = {
  beginDrag(props) {
    const { entity, left, top } = props;
    return { entity, left, top };
  }
};

@DragSource('forecastElement', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource()
}))
export default class APIForecast extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    }
  }

  remove() {
    removeAPIForecast(this.props.entity.id);
  }

  toggleExpand() {
    this.setState({expanded: !this.state.expanded})
  }

  addPlan() {
    addPlan(this.props.entity, {name: 'Super whale', icon: 'fa-space-shuttle'});
  }

  renderPlans() {
    return this.props.entity.plans.map((plan, index) => {
      return (
        <li key={`plan_${index}`}>
          <span>{plan.name}</span>
          <BasePlan key={plan.id}
                        parent={this.props.entity}
                        entity={plan}
                        name={plan.name}
                        icon={plan.icon}/>
        </li>
      )
    })
  }

  renderUpgrades() {
    return this.props.entity.upgrades.map((upgrade, index) => {
      return (
        <li key={`upgrade_${index}`}>
          <UpgradeSlider key={upgrade.id}
                         value={upgrade.value}
                         name={upgrade.name}
                         percentage={upgrade.percentage}/>
        </li>
      )
    })
  }

  render() {
    const elementClass = classNames({
      expanded: this.state.expanded
    });
    const { hideSourceOnDrag, left, top, connectDragSource, isDragging} = this.props;
    if (isDragging && hideSourceOnDrag) {
      return null;
    }
    return connectDragSource(
      <div className={`api-forecast ${elementClass}`} style={{left, top}}>
        <div className="api-forecast__header">
          {this.props.entity.name}
          <ul className="api-forecast__header__nav">
            <li><a onClick={this.remove.bind(this)}><i className="fa fa-remove"></i></a></li>
            <li><a onClick={this.toggleExpand.bind(this)}><i className="fa fa-expand"></i></a></li>
          </ul>
        </div>
        <div className="api-forecast__content">
          Here comes the chart
        </div>
        <div className="expanded-only">
          <div className="api-forecast__date-slider">
            <DateSlider parent={this.props.entity}/>
          </div>
          <ul className="api-forecast__plans">
            {this.renderPlans()}
            <li>
              <a className="api-forecast__add-plan" onClick={this.addPlan.bind(this)}><i className="fa fa-plus"></i></a>
            </li>
          </ul>
          <ul className="api-forecast__upgrade-sliders">
            {this.renderUpgrades()}
          </ul>
        </div>
      </div>
    );
  }
}
