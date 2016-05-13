import ConnectionFactory from 'models/Connection';
import _ from 'lodash';
import BaseStore from './BaseStore';

const connections = [];

class Connection extends BaseStore {
  constructor() {
    super();

    this.subscribe(() => this._registerEvents.bind(this));
  }

  _registerEvents(action) {
    switch (action.type) {
      case 'AddConnection':
        const fromId = this.formatId(action.from);
        const toId = this.formatId(action.to);
        const connection = ConnectionFactory.create({
          fromId: fromId,
          toId: toId,
          info: action.info
        });

        this.addConnection(connection);
        this.emitChange();

        break;
      case 'RemoveConnection':
        this._handleConnectionRemoval(action);
        break;

      case 'MoveConnection':
        this._handleConnectionReplace(action);
        break;
    }
  }

  addConnection(connection) {
    connections.push(connection);
  }

  removeConnection(index) {
    if (index > -1) {
      connections.splice(index, 1);
    }
  }

  removeMultipleConnections(connections) {
    connections.forEach((connection) => {
      this.removeConnection(this.findEntityIndexBySourceAndTarget(connection.fromId, connection.toId));
    });
  }

  getConnectionsForTarget(target) {
    return this.search({toId: target});
  }

  getConnectionsForSource(source) {
    return this.search({fromId: source});
  }

  getLastConnection() {
    return connections.slice(-1)[0];
  }

  findEntity(id) {
    return _.find(connections, {id: id});
  }

  search(filter) {
    return _.filter(connections, filter);
  }

  findEntityIndex(id) {
    return _.findIndex(connections, {id: id});
  }

  findEntityIndexBySourceAndTarget(from, to) {
    const fromId = this.formatId(from);
    const toId = this.formatId(to);

    return _.findIndex(connections, {fromId: fromId, toId: toId});
  }

  /**
   * Update connection specific attributes
   * @param connection {Connection}
   * @param attributes {Object}
   */
  updateConnection(connection, attributes) {
    const index = this.findEntityIndex(connection.id);

    if (index > -1) {
      Object.keys(attributes).forEach((attributeKey) => {
        connections[index][attributeKey] = attributes[attributeKey];
      });

      this.emitChange();
    }
  }

  _handleConnectionRemoval(action) {
    if (action.from && action.to) {
      if (this.removeConnection(this.findEntityIndexBySourceAndTarget(action.from, action.to))) {
        this.emitChange();
      }
    } else if (action.to) {
      const connections = this.getConnectionsForTarget(action.to);

      if (connections.length) {
        this.removeMultipleConnections(connections);
        this.emitChange();
      }
    } else if (action.from) {
      const connections = this.getConnectionsForSource(action.from);

      if (connections.length) {
        this.removeMultipleConnections(connections);
        this.emitChange();
      }
    }
  }

  _handleConnectionReplace(action) {
    const currentConnectionIndex = this.findEntityIndexBySourceAndTarget(action.from, action.to);

    if (currentConnectionIndex > -1) {
      this.removeConnection(currentConnectionIndex);

      const fromId = this.formatId(action.newFrom);
      const toId = this.formatId(action.newTo);
      const connection = ConnectionFactory.create({
        fromId: fromId,
        toId: toId,
        info: action.info
      });

      this.addConnection(connection);
    }
  }

  getData() {
    return connections;
  }
}

export default new Connection;
