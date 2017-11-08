import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {Input, Table, Select} from '../../../../../lunchbadger-ui/src';

class PolicyProxyActionPair extends PureComponent {
  render() {
    const {pair: {id, action: {parameters}}, namePrefix, serviceEndpointOptions} = this.props;
    const serviceEndpoint = (parameters.find(p => p.name === 'serviceEndpoint') || serviceEndpointOptions[0] || {value: ''}).value;
    const changeOrigin = (parameters.find(p => p.name === 'changeOrigin') || {value: 'true'}).value.toString() === 'true';
    const changeOriginOptions = [false, true].map(value => ({label: value.toString(), value}));
    const columns = [
      'Parameter Name',
      'Parameter Value',
      <Input
        type="hidden"
        name={`${namePrefix}[id]`}
        value={id}
      />,
    ];
    const widths = [350, undefined, 70];
    const paddings = [true, true, false];
    const data = [
      [
        'serviceEndpoint',
        <Select
          name={`${namePrefix}[action][0][value]`}
          value={serviceEndpoint}
          options={serviceEndpointOptions}
          fullWidth
          hideUnderline
        />,
        <Input
          type="hidden"
          name={`${namePrefix}[action][0][name]`}
          value="serviceEndpoint"
        />,
      ],
      [
        'changeOrigin',
        <Select
          name={`${namePrefix}[action][1][value]`}
          value={changeOrigin}
          options={changeOriginOptions}
          fullWidth
          hideUnderline
        />,
        <Input
          type="hidden"
          name={`${namePrefix}[action][1][name]`}
          value="changeOrigin"
        />,
      ]
    ];
    return (
      <Table
        columns={columns}
        data={data}
        widths={widths}
        paddings={paddings}
      />
    );
  }
}

const selector = createSelector(
  state => state.plugins.quadrants[1].serviceEndpointEntities,
  state => state.entities,
  (serviceEndpointEntities, entities) => ({
    serviceEndpointOptions: serviceEndpointEntities
      .map(kind => Object.keys(entities[kind]).map(value => ({
        label: entities[kind][value].name,
        value
      })))
      .reduce((arr, i) => arr = arr.concat(i), [])
      .sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase())
  }),
);

export default connect(selector)(PolicyProxyActionPair);
