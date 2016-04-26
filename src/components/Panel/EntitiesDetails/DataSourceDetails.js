import React, {Component, PropTypes} from 'react';
import BaseDetails from './BaseDetails.js'
import updateDataSource from 'actions/CanvasElements/DataSource/update';

class DataSourceDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      url: props.entity.url,
      schema: props.entity.schema,
      username: props.entity.username,
      password: props.entity.password
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      url: props.entity.url,
      schema: props.entity.schema,
      username: props.entity.username,
      password: props.entity.password
    });
  }

  update() {
    updateDataSource(this.props.entity.id, {
      name: this.props.name,
      url: this.state.url,
      schema: this.state.schema,
      username: this.state.username,
      password: this.state.password
    });
  }

  updateProperty(event, key) {
    const {target} = event;
    const newState = {};

    newState[key] = target.value;

    this.setState(newState);
  }


  render() {
    return (
      <div className="details-panel__container details-panel__columns">
        <div className="details-panel__fieldset">
          <span className="details-panel__label">URL</span>
          <input className="details-panel__input"
                 value={this.state.url}
                 type="text"
                 onChange={(event) => this.updateProperty(event, 'url')}/>
        </div>
        <div className="details-panel__fieldset">
          <span className="details-panel__label">Schema</span>
          <input className="details-panel__input"
                 value={this.state.schema}
                 type="text"
                 onChange={(event) => this.updateProperty(event, 'schema')}/>
        </div>
        <div className="details-panel__fieldset">
          <span className="details-panel__label">Username</span>
          <input className="details-panel__input"
                 value={this.state.username}
                 type="text"
                 onChange={(event) => this.updateProperty(event, 'username')}/>
        </div>
        <div className="details-panel__fieldset">
          <span className="details-panel__label">Password</span>
          <input className="details-panel__input"
                 value={this.state.password}
                 type="text"
                 onChange={(event) => this.updateProperty(event, 'password')}/>
        </div>
      </div>
    )
  }
}

export default BaseDetails(DataSourceDetails);

