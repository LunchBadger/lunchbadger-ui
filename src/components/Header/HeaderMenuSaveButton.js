import React, {Component} from 'react';
import classNames from 'classnames';
import Connection from 'stores/Connection';
import AppState from 'stores/AppState';
import ProjectService from 'services/ProjectService';
import {notify} from 'react-notify-toast';

export default class HeaderMenuSaveButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pressed: false
    };
  }

  saveDetails() {
    let storesList = [
      Connection
    ];

    const saveableServices = [];

    const project = {
      connections: [],
      states: []
    };

    if (LunchBadgerManage) {
      storesList.push(
        LunchBadgerManage.stores.Private,
        LunchBadgerManage.stores.Gateway,
        LunchBadgerManage.stores.Public
      );

      project.privateEndpoints = [];
      project.gateways = [];
      project.publicEndpoints = [];
    }

    if (LunchBadgerCompose) {
      storesList.push(
        LunchBadgerCompose.stores.Backend
      );

      project.dataSources = [];
      project.privateModels = [];
    }

    if (LunchBadgerMonetize) {
      project.apis = [];
      project.portals = [];
    }

    storesList.forEach((store) => {
      const entities = store.getData();

      entities.forEach((entity) => {
        switch (entity.constructor.type) {
          case 'Connection':
            project.connections.push(entity.toJSON());
            break;
          case 'DataSource':
            project.dataSources.push(entity.toJSON());
            break;
          case 'Model':
            project.privateModels.push(entity.toJSON());
            break;
          case 'PrivateEndpoint':
            project.privateEndpoints.push(entity.toJSON());
            break;
          case 'Gateway':
            project.gateways.push(entity.toJSON());
            break;
          case 'PublicEndpoint':
            project.publicEndpoints.push(entity.toJSON());
            break;
          case 'API':
            project.apis.push(entity.toJSON());
            break;
          case 'Portal':
            project.portals.push(entity.toJSON());
            break;
        }
      });
    });

    const states = AppState.getData();
    const rev = AppState.getProjectRevision();

    // prepare appState
    if (states['currentlyOpenedPanel']) {
      project.states.push({
        key: 'currentlyOpenedPanel',
        value: states['currentlyOpenedPanel']
      });
    }

    if (states['currentElement']) {
      const {currentElement} = states;

      if (typeof currentElement.toJSON === 'function') {
        project.states.push({
          key: 'currentElement',
          value: {
            ...currentElement.toJSON(),
            type: currentElement.constructor.type
          }
        });
      }
    }

    if (states['currentForecast']) {
      const currentForecast = states['currentForecast'];

      project.states.push({
        key: 'currentForecast',
        value: {
          id: currentForecast['forecast']['id'],
          expanded: currentForecast['expanded'] || false,
          left: currentForecast['forecast']['left'] || 0,
          top: currentForecast['forecast']['top'] || 0,
          selectedDate: currentForecast['selectedDate']
        }
      });
    }

    let projSave = ProjectService
      .save('roman', 'dev', project, rev)
      .then(res => {
        let newRev = res.response.headers['etag'];
        LunchBadgerCore.actions.Stores.AppState.setProjectRevision(newRev);
      });

    saveableServices.push(projSave);

    // save api forecasts
    if (LunchBadgerOptimize) {
      const forecasts = LunchBadgerOptimize.stores.Forecast.getData();
      const ForecastService = LunchBadgerOptimize.services.ForecastService;

      forecasts.forEach((forecast) => {
        saveableServices.push(ForecastService.save(forecast.id, forecast.toJSON()));
      });
    }

    Promise.all(saveableServices).then(() => {
      notify.show('All data has been synced with API', 'success');
    }).catch(() => {
      notify.show('Cannot save data to local API', 'error');
    });
  }

  render() {
    const linkClass = classNames({
      'header__menu__link': true,
      'header__menu__link--hidden': true
    });

    return (
      <a href="#" className={linkClass} onClick={this.saveDetails.bind(this)}>
        <i className="fa fa-floppy-o"/>
      </a>
    );
  }
}
