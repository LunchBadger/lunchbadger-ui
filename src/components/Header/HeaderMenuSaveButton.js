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

    const project = AppState.getStateKey('currentProject');
    const data = {
      name: project.name,
      connections: []
    };

    if (LunchBadgerManage) {
      storesList.push(
        LunchBadgerManage.stores.Private,
        LunchBadgerManage.stores.Gateway,
        LunchBadgerManage.stores.Public
      );

      data.privateEndpoints = [];
      data.gateways = [];
      data.publicEndpoints = [];
    }

    if (LunchBadgerCompose) {
      storesList.push(
        LunchBadgerCompose.stores.Backend
      );

      data.dataSources = [];
      data.privateModels = [];
    }

    if (LunchBadgerMonetize) {
      data.apis = [];
    }

    storesList.forEach((store) => {
      const entities = store.getData();

      entities.forEach((entity) => {
        switch (entity.constructor.type) {
          case 'Connection':
            data.connections.push(entity.toJSON());
            break;
          case 'DataSource':
            data.dataSources.push(entity.toJSON());
            break;
          case 'Model':
            data.privateModels.push(entity.toJSON());
            break;
          case 'PrivateEndpoint':
            data.privateEndpoints.push(entity.toJSON());
            break;
          case 'Gateway':
            data.gateways.push(entity.toJSON());
            break;
          case 'PublicEndpoint':
            data.publicEndpoints.push(entity.toJSON());
            break;
          case 'API':
            data.apis.push(entity.toJSON());
            break;
        }
      });
    });

    ProjectService.save(project.id, data).then(() => {
      notify.show('All data has been synced with API', 'success');
    }).catch(() => {
      notify.show('Cannot save data to local API', 'error');
    });
  }

  render() {
    const linkClass = classNames({
      'header__menu__link': true
    });

    return (
      <a href="#" className={linkClass} onClick={this.saveDetails.bind(this)}>
        <i className="fa fa-floppy-o"/>
      </a>
    );
  }
}
