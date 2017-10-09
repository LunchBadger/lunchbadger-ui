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

  render() {
    const {id, connectionsStore, details} = this.props;
    const state = this.context.store.getState();
    const triggers = [];
    const connsTo = connectionsStore.search({toId: id});
    connsTo.forEach((conn) => {
      triggers.push({
        type: 'Connector',
        source: state.entities.dataSources[conn.fromId].name,
      });
    });
    const connsFrom = connectionsStore.search({fromId: id});
    connsFrom.forEach((conn) => {
      triggers.push({
        type: 'API Gateway',
        source: findGatewayByPipelineId(state, conn.toId)
          .pipelines
          .find(({id}) => id === conn.toId)
          .name,
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
    const columns = ['Type','Source'];
    const widths = [300, undefined];
    const paddings = [true, true];
    const centers = [false, false];
    const data = triggers.map(({type, source}) => [type, source]);
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
