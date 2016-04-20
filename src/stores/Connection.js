import BaseStore from './BaseStore';
import ConnectionClass from 'models/Connection';
import _ from 'lodash';

const connections = [];

class Connection extends BaseStore {
  constructor() {
    super();

    this.subscribe(() => this._registerEvents.bind(this));
  }

  _registerEvents(action) {
    switch (action.type) {
      case 'AddConnection':
        const fromId = this._formatPortId(action.from);
        const toId = this._formatPortId(action.to);
        const connection = ConnectionClass.create({
          fromId: fromId,
          toId: toId,
          info: action.info
        });

        this.addConnection(connection);
        this.emitChange();

        break;
      case 'RemoveConnection':
        if (this.removeConnection(this.findEntityIndexBySourceAndTarget(action.from, action.to))) {
          this.emitChange();
        }

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

  getLastConnection() {
    return connections.slice(-1)[0];
  }

  findEntity(id) {
    return _.find(connections, {id: id});
  }

  findEntityIndex(id) {
    return _.findIndex(connections, {id: id});
  }

  findEntityIndexBySourceAndTarget(from, to) {
    const fromId = this._formatPortId(from);
    const toId = this._formatPortId(to);

    return _.findIndex(connections, {fromId: fromId, toId: toId});
  }

  _formatPortId(portId) {
    const idSplit = portId.split('_');

    return idSplit.slice(-1)[0];
  }
}

export default new Connection;
