import React, {Component, PropTypes} from 'react';
import {DragSource} from 'react-dnd';
import classNames from 'classnames';
import './APIForecast.scss';
import removeAPIForecast from 'actions/API/remove';
import BaseCreature from 'components/PanelComponents/Subelements/BaseCreature';
import addCreature from 'actions/API/addCreature';
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

  addCreature() {
    addCreature(this.props.entity, {name: 'Super whale', icon: 'fa-space-shuttle'});
  }

  renderCreatures() {
    return this.props.entity.creatures.map((creature, index) => {
      return (
        <li key={`creature_${index}`}>
          <span>{creature.name}</span>
          <BaseCreature key={creature.id}
                        parent={this.props.entity}
                        entity={creature}
                        name={creature.name}
                        icon={creature.icon}/>
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
          <ul className="api-forecast__creature-plans">
            {this.renderCreatures()}
            <li>
              <a className="api-forecast__add-plan" onClick={this.addCreature.bind(this)}><i className="fa fa-plus"></i></a>
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
