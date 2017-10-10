import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import {Table} from '../../../../../lunchbadger-ui/src';
import '../Function.scss';

const {utils: {storeUtils:{findGatewayByPipelineId}}} = LunchBadgerCore;

@inject('connectionsStore') @observer
class FunctionTriggers extends PureComponent {
  static contextTypes = {
    store: PropTypes.object,
  };

  renderDetails = details => details.map((entry, idx1) => (
    <div key={idx1} className="triggers__details">
      {entry.map((item, idx2) => <span key={idx2}>{item}</span>)}
    </div>
  ));

  render() {
    const {id, connectionsStore, details} = this.props;
    const state = this.context.store.getState();
    const triggers = [];
    const connsTo = connectionsStore.search({toId: id});
    connsTo.forEach((conn) => {
      triggers.push({
        type: 'Datasource',
        source: state.entities.dataSources[conn.fromId].name,
        details: [[<code>Object Create</code>, <code>Object Update</code>]],
      });
    });
    const connsFrom = connectionsStore.search({fromId: id});
    const gateways = {};
    connsFrom.forEach((conn) => {
      const gateway = findGatewayByPipelineId(state, conn.toId);
      const connsApiEndpoints = connectionsStore.search({fromId: conn.toId});
      connsApiEndpoints.forEach((connAE) => {
        if (!gateways[gateway.id]) {
          gateways[gateway.id] = {
            name: gateway.name,
            apiEndpoints: [],
          }
        }
        gateways[gateway.id].apiEndpoints.push([
          state.entities.apiEndpoints[connAE.toId].name,
          <code>GET</code>,
          <code>POST</code>,
        ]);
      });
    });
    Object.keys(gateways).forEach((key) => {
      triggers.push({
        type: 'API Gateway',
        source: gateways[key].name,
        details: gateways[key].apiEndpoints,
      });
    });
    if (!details) {
      return (
        <div className="Function__triggers">
          {triggers.map(({type, source}, idx) => (
            <div key={idx}>
              <span>{type}</span>
              <span>{source}</span>
            </div>
          ))}
        </div>
      );
    }
    const columns = ['Type', 'Source', 'Details'];
    const widths = [300, 300, undefined];
    const paddings = [false, false, false];
    const centers = [false, false, false];
    const data = triggers.map(({type, source, details}, idx) => [type, source, this.renderDetails(details, idx)]);
    return <Table
      columns={columns}
      data={data}
      widths={widths}
      paddings={paddings}
      centers={centers}
    />;
  }
}

export default FunctionTriggers;
