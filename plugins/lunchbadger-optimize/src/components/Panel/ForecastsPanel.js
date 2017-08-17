import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {DropTarget} from 'react-dnd';
import classNames from 'classnames';
import APIForecast from '../PanelComponents/APIForecast';
import {addAPIForecast, updateAPIForecast} from '../../reduxActions/forecasts';
import './ForecastsPanel.scss';

export const FORECASTS_PANEL = 'FORECASTS_PANEL';

const Panel = LunchBadgerCore.components.Panel;

const boxTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    if (item.entity.constructor.type === 'API') {
      const delta = monitor.getSourceClientOffset();
      if (!props.forecasts[item.entity.id]) {
        props.dispatch(addAPIForecast(item.entity, delta.x, delta.y - 30));
        component.setState({hasDropped: true});
      }
    } else if (item.entity.constructor.type === 'APIForecast') {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.entity.left + delta.x);
      const top = Math.round(item.entity.top + delta.y);
      component.moveEntity(item.entity, left, top);
    } else if (item.entity.constructor.type === 'Portal') {
      // const delta = monitor.getSourceClientOffset();
      // const {currentlySelectedSubelements} = props;
      // if (!Forecast.findEntityByApiId(currentlySelectedSubelements[0].id)) { // FIXME - handle Portal selectable APIs
      //   props.dispatch(addAPIForecast(currentlySelectedSubelements[0], delta.x, delta.y - 30));
      //   component.setState({hasDropped: true});
      // }
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
      expanded: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {currentForecastInformation} = nextProps;
    if (currentForecastInformation && currentForecastInformation.expanded) {
      this.setState({expanded: currentForecastInformation.id});
    }
  }

  moveEntity = (entity, left, top) => this.props.dispatch(updateAPIForecast(entity.id, {left, top}));

  // componentDidMount() {
  //   Forecast.addChangeListener(() => {
  //     this.setState({entities: Forecast.getData()});
  //   });
  //
  //   AppState.addChangeListener(() => {
  //     const currentForecastInformation = AppState.getStateKey('currentForecastInformation');
  //
  //     if (currentForecastInformation && currentForecastInformation.expanded) {
  //       this.setState({expanded: currentForecastInformation.id});
  //     }
  //   });
  // }

  _handleExpand(forecastId) {
    if (this.state.expanded === forecastId) {
      this.setState({expanded: false});
    } else {
      this.setState({expanded: forecastId});
    }
  }

  render() {
    const {connectDropTarget, isOver, canDrop, forecasts, height} = this.props;
    const panelClass = classNames({
      'panel__forecast-drop': true,
      'panel__forecast-drop--over': isOver && canDrop
    });
    const entities = Object.keys(forecasts).map(key => forecasts[key]);
    const {expanded} = this.state;
    return connectDropTarget(
      <div className="panel__body forecasts">
        {entities.length === 0 && (
          <div className={panelClass}>
            <div className="panel__forecast-drop__inside">
              Drag objects here to forecast them
            </div>
          </div>
        )}
        {entities.length > 0 && entities.map(entity => (
          <APIForecast
            key={entity.id}
            onExpand={() => this._handleExpand(entity.id)}
            onClose={() => expanded === entity.id && this.setState({expanded: null})}
            isExpanded={expanded === entity.id}
            entity={entity}
            panelHeight={height}
            top={entity.top}
            left={entity.left}
          />
        ))}
      </div>
    );
  }
}

const selector = createSelector(
  state => state.states.currentlySelectedSubelements || [],
  state => state.states.currentForecastInformation,
  state => state.entities.forecasts,
  (currentlySelectedSubelements, currentForecastInformation, forecasts) =>
    ({currentlySelectedSubelements, currentForecastInformation, forecasts}),
);

export default connect(selector)(Panel(
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
