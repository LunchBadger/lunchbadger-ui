import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {
  EntityProperty,
} from '../../../../../../lunchbadger-ui/src';
import './GatewayProxyServiceEndpoint.scss';

class GatewayProxyServiceEndpoint extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    description: PropTypes.string,
    onChange: PropTypes.func,
  };

  handleChange = value => this.props.onChange({target: {value}});

  render() {
    const {
      name,
      value,
      description,
      options,
    } = this.props;
    return (
      <EntityProperty
        title="ServiceEndpoint"
        name={name}
        value={value || options[0].value}
        onBlur={undefined}
        placeholder=" "
        options={options}
        description={description}
        onChange={this.handleChange}
      />
    );
  }
}

const selector = createSelector(
  state => state.plugins.quadrants[1].serviceEndpointEntities,
  state => state.entities,
  (serviceEndpointEntities, entities) => ({
    options: serviceEndpointEntities
      .map(kind => Object.keys(entities[kind]).map(value => ({
        label: entities[kind][value].name,
        value
      })))
      .reduce((arr, i) => arr = arr.concat(i), [])
      .sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase())
  }),
);

export default connect(selector)(GatewayProxyServiceEndpoint);
