import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import './GatewayProxyServiceEndpoint.scss';

const {
  UI: {EntityProperty, sortStrings},
} = LunchBadgerCore;

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
    const availableOptions = [
      {label: '[None]', value: undefined},
      ...options,
    ];
    return (
      <EntityProperty
        title="ServiceEndpoint"
        name={name}
        value={value || availableOptions[0].value}
        onBlur={undefined}
        placeholder=" "
        options={availableOptions}
        description={description}
        onChange={this.handleChange}
        width="calc(100% - 50px)"
        type="select"
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
      .filter(item => !!item.label)
      .sort(sortStrings('label'))
  }),
);

export default connect(selector)(GatewayProxyServiceEndpoint);
