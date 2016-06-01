import React, {Component, PropTypes} from 'react';
import {notify} from 'react-notify-toast';
import ForecastService from 'services/ForecastService';
import removeAPIForecast from 'actions/APIForecast/remove';

export default class ForecastNav extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    onExpand: PropTypes.func.isRequired
  };
  
  save() {
    ForecastService.save(this.props.entity.id, this.props.entity.toJSON()).then(() => {
      notify.show('Forecast has been successfully saved into local API', 'success');
    }).catch(() => {
      notify.show('There are problems with syncing data with local API, check console for more', 'error');
    });
  }

  remove() {
    removeAPIForecast(this.props.entity.id);
  }

  toggleExpand() {
    this.props.onExpand();
  }
  
  render() {
    return (
      <ul className="api-forecast__header__nav">
        <li>
          <a onClick={this.save.bind(this)}>
            <i className="fa fa-floppy-o"/>
          </a>
        </li>
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
    );
  }
}
