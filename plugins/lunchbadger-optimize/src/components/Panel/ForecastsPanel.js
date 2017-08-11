import React, {Component} from 'react';
import {connect} from 'react-redux';
import {DropTarget} from 'react-dnd';
import APIForecast from '../PanelComponents/APIForecast';
import addAPIForecast from '../../actions/APIForecast/add';
import updateAPIForecast from '../../actions/APIForecast/update';
import Forecast from '../../stores/Forecast';
import './ForecastsPanel.scss';
import classNames from 'classnames';

export const FORECASTS_PANEL = 'FORECASTS_PANEL';

const Panel = LunchBadgerCore.components.Panel;
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
    } else if (item.entity.constructor.type === 'Portal') {
      const delta = monitor.getSourceClientOffset();
      const {currentlySelectedSubelements} = props;
      if (!Forecast.findEntityByApiId(currentlySelectedSubelements[0].id)) { // FIXME - handle Portal selectable APIs
        addAPIForecast(currentlySelectedSubelements[0], delta.x, delta.y - 30);
        component.setState({hasDropped: true});
      }
    }
  },

  canDrop(props, monitor) {
    const item = monitor.getItem();
    const {currentlySelectedSubelements} = props;
    return item.entity.constructor.type === 'API' ||
      item.entity.constructor.type === 'APIForecast' ||
      item.entity.constructor.type === 'Portal'  && currentlySelectedSubelements.length === 1;
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
                          panelHeight={this.props.height}
                          top={entity.top}
                          left={entity.left}/>;
    })
  }

  render() {
    const {connectDropTarget, isOver, canDrop} = this.props;
    const panelClass = classNames({
      'panel__forecast-drop': true,
      'panel__forecast-drop--over': isOver && canDrop
    });

    return connectDropTarget(
      <div className="panel__body">
        {
          this.state.entities.length === 0 && (
            <div className={panelClass}>
              <div className="panel__forecast-drop__inside">
                Drag objects here to forecast them
              </div>
            </div>
          )
        }

        {this.state.entities.length > 0 && this.renderEntities()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentlySelectedSubelements: state.states.currentlySelectedSubelements,
});

export default connect(mapStateToProps)(Panel(
  DropTarget(
    ['canvasElement', 'elementsGroup', 'forecastElement'],
    boxTarget,
    (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({shallow: true}),
      canDrop: monitor.canDrop()
    }),
  )(ForecastsPanel),
));
