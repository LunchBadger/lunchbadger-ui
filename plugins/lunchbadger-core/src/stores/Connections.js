// import ConnectionFactory from '../models/Connection';
import {observable, action, computed, autorun, createTransformer} from 'mobx';
import _ from 'lodash';
import {formatId} from '../utils/storeUtils';
import ConnectionFactory from '../models/Connection';

class Connections {
  @observable connections = [];
  connectionsHistory = [];

  // constructor() {
  //   autorun(() => console.log(this.report));
  // }

  @action includeConnection(connection) {
    this.connections.push(connection);
    const {fromId, toId} = connection;
    if (!_.find(this.connectionsHistory, {fromId, toId})) {
      this.connectionsHistory.push({fromId, toId});
    }
  }

  @action deleteConnection(index) {
    if (index > -1) {
      this.connections.splice(index, 1);
    }
  }

  @computed get report() {
    return this.connections.map(({fromId, toId, info}) => ({fromId, toId, info}));
  }

  toJSON() {
    return this.connections.map(({fromId, toId}) => ({fromId, toId}));
  }

  addConnectionByInfo(info) {
    const {sourceId, targetId} = info;
    this.addConnection(sourceId, targetId, info);
  }

  addConnection(fromId, toId, info) {
    this.includeConnection(ConnectionFactory.create({
      fromId: formatId(fromId),
      toId: formatId(toId),
      info,
    }));
  }

  moveConnection(info) {
    const {
      originalSourceId,
      originalTargetId,
      newSourceId,
      newSourceEndpoint,
      newTargetId,
      newTargetEndpoint,
    } = info;
    const {element: {parentElement: {classList: source}}} = newSourceEndpoint;
    const {element: {parentElement: {classList: target}}} = newTargetEndpoint;
    let currentConnectionIndex = this.findEntityIndexBySourceAndTarget(originalSourceId, originalTargetId);
    if (currentConnectionIndex > -1) {
      this.deleteConnection(currentConnectionIndex);
    }
    currentConnectionIndex = this.findEntityIndexBySourceAndTarget(originalTargetId, originalSourceId);
    if (currentConnectionIndex > -1) {
      this.deleteConnection(currentConnectionIndex);
    }
    let flip = false;
    if (source.contains('port-in')) {
      if (!(source.contains('port-Function') && target.contains('port-Model'))) {
        flip = true;
      }
    }
    if (source.contains('port-out') && source.contains('port-Model') && target.contains('port-Function')) {
      flip = true;
    }
    const sourceId = flip ? newTargetId : newSourceId;
    const targetId = flip ? newSourceId : newTargetId;
    if (flip) {
      info.newSourceEndpoint = newTargetEndpoint;
      info.newTargetEndpoint = newSourceEndpoint;
      info.newSourceId = newTargetId;
      info.newTargetId = newSourceId;
    }
    this.addConnection(sourceId, targetId, info);
  }

  removeConnection(fromId, toId) {
    if (fromId && toId) {
      if (this.deleteConnection(this.findEntityIndexBySourceAndTarget(fromId, toId))) {
      }
    } else if (toId) {
      const connections = this.getConnectionsForTarget(toId);
      if (connections.length) {
        this.removeMultipleConnections(connections);
      }
    } else if (fromId) {
      const connections = this.getConnectionsForSource(fromId);
      if (connections.length) {
        this.removeMultipleConnections(connections);
      }
    }
  }

  findEntityIndexBySourceAndTarget(fromId, toId) {
    return _.findIndex(this.connections, {
      fromId: formatId(fromId),
      toId: formatId(toId),
    });
  }

  connectionExists(sourceId, targetId) {
    return this.findEntityIndexBySourceAndTarget(sourceId, targetId) >= 0 ||
      this.findEntityIndexBySourceAndTarget(targetId, sourceId) >= 0;
  }

  isFromTo(fromId, toId) {
    return this.findEntityIndexBySourceAndTarget(fromId, toId) > -1;
  }

  getConnectionsForTarget(target) {
    return this.search({toId: formatId(target)});
  }

  getConnectionsForSource(source) {
    return this.search({fromId: formatId(source)});
  }

  search(filter) {
    return _.filter(this.connections, filter);
  }

  find(filter){
    return _.find(this.connections, filter);
  }

  findHistory(filter){
    return _.find(this.connectionsHistory, filter);
  }

  @computed get conns() {
    return this.connections.map(({fromId, toId}) => ({fromId, toId}));
  }

  removeMultipleConnections(connections) {
    connections.forEach((connection) => {
      this.deleteConnection(this.findEntityIndexBySourceAndTarget(connection.fromId, connection.toId));
    });
  }

  isPortConnected(way, id) {
    if (way === 'out') {
      const conns = this.connections
        .filter(({fromId, toId}) => fromId === id || toId === id)
        .filter(({fromId, info: {source, newSourceEndpoint, target, newTargetEndpoint}}) => {
          const sourceEndpoint = newSourceEndpoint ? newSourceEndpoint.element : source;
          const targetEndpoint = newTargetEndpoint ? newTargetEndpoint.element : target;
          if (!sourceEndpoint || !targetEndpoint) return false;
          const sc = sourceEndpoint.parentElement.classList;
          const tc = targetEndpoint.parentElement.classList;
          return ((fromId === id && sc.contains('port-out') && tc.contains('port-in'))
            || (sc.contains('port-out') && tc.contains('port-out') && sc.contains('port-Function') && tc.contains('port-Model')));
        });
      return conns.length > 0;
    }
    if (way === 'in') {
      const conns = this.connections
        .filter(({fromId, toId}) => fromId === id || toId === id)
        .filter(({toId, info: {source, newSourceEndpoint, target, newTargetEndpoint}}) => {
          const sourceEndpoint = newSourceEndpoint ? newSourceEndpoint.element : source;
          const targetEndpoint = newTargetEndpoint ? newTargetEndpoint.element : target;
          if (!sourceEndpoint || !targetEndpoint) return false;
          const sc = sourceEndpoint.parentElement.classList;
          const tc = targetEndpoint.parentElement.classList;
          return ((toId === id && sc.contains('port-out') && tc.contains('port-in'))
            || (sc.contains('port-in') && tc.contains('port-in') && sc.contains('port-Function') && tc.contains('port-Model')));
        });
      return conns.length > 0;
    }
    return false;
  }

  getLastConnection() {
    return this.connections.slice(-1)[0];
  }

  // _registerEvents = (action) => {
  //   switch (action.type) {
  //     case 'AddConnection':
  //       const fromId = this.formatId(action.from);
  //       const toId = this.formatId(action.to);
  //       const connection = ConnectionFactory.create({
  //         fromId: fromId,
  //         toId: toId,
  //         info: action.info
  //       });
  //       this.addConnection(connection);
  //       this.emitChange();
  //       break;
  //     case 'RemoveConnection':
  //       this._handleConnectionRemoval(action);
  //       this.emitChange();
  //       break;
  //     case 'MoveConnection':
  //       this._handleConnectionReplace(action);
  //       this.emitChange();
  //       break;
  //     case 'RemoveEntity':
  //       this._handleConnectionRemoval({from: action.entity.id});
  //       this._handleConnectionRemoval({to: action.entity.id});
  //       if (action.entity.constructor.type === 'API') {
  //         action.entity.publicEndpoints.forEach((endpoint) => {
  //           this._handleConnectionRemoval({from: endpoint.id});
  //           this._handleConnectionRemoval({to: endpoint.id});
  //         });
  //       } else if (action.entity.constructor.type === 'Gateway') {
  //         action.entity.pipelines.forEach((pipeline) => {
  //           this._handleConnectionRemoval({from: pipeline.id});
  //           this._handleConnectionRemoval({to: pipeline.id});
  //         });
  //       }
  //       this.emitChange();
  //       break;
  //     case 'RemovePipeline':
  //       this._handleConnectionRemoval({from: action.pipeline.id});
  //       this._handleConnectionRemoval({to: action.pipeline.id});
  //       this.emitChange();
  //       break;
  //     case 'ClearData':
  //       connections = [];
  //       this.emitChange();
  //       break;
  //   }
  // }
  //
  // addConnection(connection) {
  //   connections.push(connection);
  // }
  //
  // removeConnection(index) {
  //   if (index > -1) {
  //     connections.splice(index, 1);
  //   }
  // }
  //
  // removeMultipleConnections(connections) {
  //   connections.forEach((connection) => {
  //     this.removeConnection(this.findEntityIndexBySourceAndTarget(connection.fromId, connection.toId));
  //   });
  // }
  //
  // getConnectionsForTarget(target) {
  //   return this.search({toId: target});
  // }
  //
  // getConnectionsForSource(source) {
  //   return this.search({fromId: source});
  // }
  //
  // getLastConnection() {
  //   return connections.slice(-1)[0];
  // }
  //
  // findEntity(id) {
  //   return _.find(connections, {id: id});
  // }
  //
  // search(filter) {
  //   return _.filter(connections, filter);
  // }
  //
  // findEntityIndex(id) {
  //   return _.findIndex(connections, {id: id});
  // }
  //
  // findEntityIndexBySourceAndTarget(from, to) {
  //   const fromId = this.formatId(from);
  //   const toId = this.formatId(to);
  //
  //   return _.findIndex(connections, {fromId: fromId, toId: toId});
  // }
  //
  // /**
  //  * Update connection specific attributes
  //  * @param connection {Connection}
  //  * @param attributes {Object}
  //  */
  // updateConnection(connection, attributes) {
  //   const index = this.findEntityIndex(connection.id);
  //   if (index > -1) {
  //     Object.keys(attributes).forEach((attributeKey) => {
  //       connections[index][attributeKey] = attributes[attributeKey];
  //     });
  //     this.emitChange();
  //   }
  // }
  //
  // _handleConnectionRemoval(action) {
  //   if (action.from && action.to) {
  //     if (this.removeConnection(this.findEntityIndexBySourceAndTarget(action.from, action.to))) {
  //       this.emitChange();
  //     }
  //   } else if (action.to) {
  //     const connections = this.getConnectionsForTarget(action.to);
  //     if (connections.length) {
  //       this.removeMultipleConnections(connections);
  //       this.emitChange();
  //     }
  //   } else if (action.from) {
  //     const connections = this.getConnectionsForSource(action.from);
  //     if (connections.length) {
  //       this.removeMultipleConnections(connections);
  //       this.emitChange();
  //     }
  //   }
  // }
  //
  // _handleConnectionReplace(action) {
  //   const currentConnectionIndex = this.findEntityIndexBySourceAndTarget(action.from, action.to);
  //   if (currentConnectionIndex > -1) {
  //     this.removeConnection(currentConnectionIndex);
  //     const fromId = this.formatId(action.newFrom);
  //     const toId = this.formatId(action.newTo);
  //     const connection = ConnectionFactory.create({
  //       fromId: fromId,
  //       toId: toId,
  //       info: action.info
  //     });
  //     this.addConnection(connection);
  //   }
  // }
  //
  // getData() {
  //   return connections;
  // }
  //
  // setData(data) {
  //   connections = data;
  // }
}

export default new Connections();
