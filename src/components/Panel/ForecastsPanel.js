import React, {Component} from 'react';
import {DropTarget} from 'react-dnd';
import APIForecast from '../PanelComponents/APIForecast';
import addAPIForecast from 'actions/API/add';
import updateAPIForecast from 'actions/API/update';
import Forecast from 'stores/Forecast';

export const FORECASTS_PANEL = 'FORECASTS_PANEL';

const boxTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    if (item.entity.constructor.type === 'API') {
      const delta = monitor.getSourceClientOffset();
      addAPIForecast(item.entity, delta.x, delta.y - 30);
      component.setState({
        hasDropped: true
      });
    } else if (item.entity.apiId) {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.entity.left + delta.x);
      const top = Math.round(item.entity.top + delta.y);
      component.moveEntity(item.entity, left, top);
    }
  }
};

class ForecastsPanel extends Component {
  constructor(props) {
    super(props);

    props.parent.storageKey = FORECASTS_PANEL;

    this.state = {
      hasDropped: false,
      entities: Forecast.getData()
    };
  }

  moveEntity(entity, left, top) {
    updateAPIForecast(entity.id, {left, top});
  }

  componentDidMount() {
    Forecast.addChangeListener(() => {
      this.setState({entities: Forecast.getData()});
    })
  }

  renderEntities() {
    return this.state.entities.map((entity) => {
      return <APIForecast key={entity.id}
                          entity={entity}
                          top={entity.top}
                          left={entity.left}/>;
    })
  }

  render() {
    const {connectDropTarget} = this.props;
    return connectDropTarget(
      <div className="panel__body">
        <div className="panel__title">
          {this.renderEntities()}
        </div>
      </div>
    );
  }
}

export default LunchBadgerCore.components.Panel(DropTarget(['canvasElement', 'forecastElement'], boxTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(ForecastsPanel));
