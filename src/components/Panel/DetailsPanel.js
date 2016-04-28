import React, {Component} from 'react';
import Panel from './Panel';
import panelKeys from 'constants/panelKeys';
import PublicEndpointDetails from './EntitiesDetails/PublicEndpointDetails';
import PrivateEndpointDetails from './EntitiesDetails/PrivateEndpointDetails';
import APIDetails from './EntitiesDetails/APIDetails';
import ModelDetails from './EntitiesDetails/ModelDetails';
import GatewayDetails from './EntitiesDetails/GatewayDetails';
import DataSourceDetails from './EntitiesDetails/DataSourceDetails';
import AppState from 'stores/AppState';

class DetailsPanel extends Component {
  constructor(props) {
    super(props);

    props.parent.storageKey = panelKeys.DETAILS_PANEL;

    this.state = {
      element: null
    };

    this.appStateUpdate = () => {
      this.setState({element: AppState.getStateKey('currentElement')});
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.opened && !this.props.opened) {
      AppState.addChangeListener(this.appStateUpdate);

      this.setState({element: AppState.getStateKey('currentElement')});
    }

    if (!nextProps.opened && this.props.opened) {
      AppState.removeChangeListener(this.appStateUpdate);
    }
  }

  renderDetails() {
    if (this.state.element) {
      switch (this.state.element.constructor.type) {
        case 'PublicEndpoint':
          return (
            <PublicEndpointDetails entity={this.state.element}/>
          );
        case 'API':
          return (
            <APIDetails entity={this.state.element}/>
          );
        case 'PrivateEndpoint':
          return (
            <PrivateEndpointDetails entity={this.state.element}/>
          );
        case 'Model':
          return (
            <ModelDetails entity={this.state.element}/>
          );
        case 'Gateway':
          return (
            <GatewayDetails entity={this.state.element}/>
          );
        case 'DataSource':
          return (
            <DataSourceDetails entity={this.state.element}/>
          );
      }
    }
  }

  render() {
    return (
      <div className="panel__body">
        <div className="panel__title">
          Details
          {this.renderDetails()}
        </div>
      </div>
    );
  }
}

export default Panel(DetailsPanel);
