import React, {Component} from 'react';
import {DropTarget} from 'react-dnd';
import APIForecast from '../PanelComponents/APIForecast';
import addAPIForecast from 'actions/APIForecast/add';
import updateAPIForecast from 'actions/APIForecast/update';
import Forecast from 'stores/Forecast';

export const FORECASTS_PANEL = 'FORECASTS_PANEL';

const AppState = LunchBadgerCore.stores.AppState;
const boxTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    if (item.entity.constructor.type === 'API') {
      const delta = monitor.getSourceClientOffset();

      if (!Forecast.findEntityByApiId(item.entity.id)) {
        addAPIForecast(item.entity, delta.x, delta.y - 30);
        component.setState({hasDropped: true});
      }
    } else if (item.entity.constructor.type === 'APIForecast') {
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
      entities: Forecast.getData(),
      expanded: null
    };
  }

  moveEntity(entity, left, top) {
    updateAPIForecast(entity.id, {left, top});
  }

  componentDidMount() {
    Forecast.addChangeListener(() => {
      this.setState({entities: Forecast.getData()});
    });

    AppState.addChangeListener(() => {
      const currentForecastInformation = AppState.getStateKey('currentForecastInformation');

      if (currentForecastInformation && currentForecastInformation.expanded) {
        this.setState({expanded: currentForecastInformation.id});
      }
    });
  }

  _handleExpand(forecastId) {
    if (this.state.expanded === forecastId) {
      this.setState({expanded: false});
    } else {
      this.setState({expanded: forecastId});
    }
  }

  renderEntities() {
    return this.state.entities.map((entity) => {
      return <APIForecast key={entity.id}
                          onExpand={() => this._handleExpand(entity.id)}
                          onClose={() => this.state.expanded === entity.id && this.setState({expanded: null})}
                          isExpanded={this.state.expanded === entity.id}
                          entity={entity}
                          top={entity.top}
                          left={entity.left}/>;
    })
  }

  render() {
    const {connectDropTarget} = this.props;
    return connectDropTarget(
      <div className="panel__body">
        {this.renderEntities()}
      </div>
    );
  }
}

export default LunchBadgerCore.components.Panel(DropTarget(['canvasElement', 'forecastElement'], boxTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(ForecastsPanel));
