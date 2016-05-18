import React, {Component, PropTypes} from 'react';
import {DragSource} from 'react-dnd';
import classNames from 'classnames';
import './APIForecast.scss';
import removeAPIForecast from 'actions/API/remove';
import BasePlan from './Subelements/BasePlan';
import addPlan from 'actions/API/addPlan';
import UpgradeSlider from 'components/PanelComponents/Subelements/UpgradeSlider';
import ForecastDetails from './Subelements/ForecastDetails';
import DateSlider from 'rc-slider';
import ForecastService from 'services/ForecastService';
import {dataKeys} from 'components/Chart/ForecastingChart';

import 'rc-slider/assets/index.css';

const boxSource = {
  beginDrag(props) {
    const {entity, left, top} = props;
    return {entity, left, top};
  }
};

@DragSource('forecastElement', boxSource, (connect) => ({
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
      expanded: false,
      data: []
    };

    this.parseDate = d3.time.format('%m/%Y').parse;

    this.prepareData = (data) => {
      return data.map((dataRow) => {
        dataRow.date = this.parseDate(dataRow.date);

        delete dataRow.id;

        Object.keys(dataKeys).forEach((dataKey) => {
          dataRow[dataKey] = +dataRow[dataKey];
        });

        return dataRow;
      });
    };
  }

  componentDidMount() {
    this._fetchForecastData();
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

  _fetchForecastData() {
    ForecastService.get(this.props.entity.api.id).then((response) => {
      const data = response.body[0].values;

      this.setState({data: this.prepareData(data)});
    }).catch((error) => {
      return console.error(error);
    });
  }

  render() {
    const elementClass = classNames({
      expanded: this.state.expanded
    });
    const {hideSourceOnDrag, left, top, connectDragSource, isDragging} = this.props;
    if (isDragging && hideSourceOnDrag) {
      return null;
    }
    return connectDragSource(
      <div className={`api-forecast ${elementClass}`} style={{left, top}}>
        <div className="api-forecast__header">
          {this.props.entity.api.name}
          <ul className="api-forecast__header__nav">
            <li>
              <a onClick={this.remove.bind(this)}>
                <i className="fa fa-remove"/>
              </a>
            </li>
            <li>
              <a onClick={this.toggleExpand.bind(this)}>
                <i className="fa fa-expand"/>
              </a>
            </li>
          </ul>
        </div>
        <div className="api-forecast__content">
          <div className="expanded-only">
            <div className="api-forecast__date-slider">
              <DateSlider parent={this.props.entity}/>
            </div>
            <ul className="api-forecast__plans">
              {/*this.renderPlans()*/}
              <li>
                <a className="api-forecast__add-plan" onClick={this.addPlan.bind(this)}>
                  <i className="fa fa-plus"/>
                </a>
              </li>
            </ul>
            <ul className="api-forecast__upgrade-sliders">
              {this.renderUpgrades()}
            </ul>
          </div>
          {
            this.state.data.length > 0 && (
              <ForecastDetails className="api-forecast__details" data={this.state.data} entity={this.props.entity}/>
            )
          }
        </div>
      </div>
    );
  }
}
