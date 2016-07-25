import _ from 'lodash';

const ConnectionFactory = LunchBadgerCore.models.Connection;
const {BaseStore, Connection} = LunchBadgerCore.stores;
const {register} = LunchBadgerCore.dispatcher.AppDispatcher;

let Publics = [];
let initCalls = 2;

class Public extends BaseStore {
  constructor() {
    super();
    register((action) => {
      switch (action.type) {
        case 'InitializePublic':
          initCalls--;
          Publics.push.apply(Publics, action.data);

          Publics = this.sortItems(Publics);

          if (initCalls === 0) {
            this.emitInit();
          } else {
            this.emitChange();
          }

          break;
        case 'UpdatePublicOrder':
          _.remove(Publics, action.entity);
          Publics.splice(action.hoverOrder, 0, action.entity);
          Publics = this.sortItems(this.setEntitiesOrder(Publics));
          this.emitChange();
          break;
        case 'AddPublicEndpoint':
          this._insertPublicEndpoint(action.endpoint);
          this.emitChange();
          break;
        case 'AddPublicEndpointAndConnect':
          const {endpoint} = action;
          this._insertPublicEndpoint(endpoint);
          Connection.addConnection(ConnectionFactory.create({
            fromId: action.sourceId,
            toId: endpoint.id,
            info: {
              source: action.outPort
            }
          }));
          this.emitChange();
          break;
        case 'RemovePublicEndpoint':
          Publics.splice(this.findEntityIndex(action.endpoint.id), 1);
          action.endpoint.remove();
          this.emitChange();
          break;
        case 'UpdatePublicEndpoint':
          this.updateEntity(action.id, action.data);
          this.emitChange();
          break;
        case 'BundleAPI':
          Publics.splice(this.findEntityIndex(action.endpoint.id), 1);
          action.api.addEndpoint(action.endpoint);
          this.emitChange();
          break;
        case 'UnbundleAPI':
          this._insertPublicEndpoint(action.endpoint);
          action.api.removeEndpoint(action.endpoint);
          this.emitChange();
          break;
        case 'RebundleAPI':
          action.fromAPI.removeEndpoint(action.endpoint);
          action.toAPI.addEndpoint(action.endpoint);
          this.emitChange();
          break;
        case 'AddAPI':
          Publics.push(action.API);
          action.API.itemOrder = Publics.length - 1;
          this.emitChange();
          break;
        case 'UpdateAPI':
          this.updateEntity(action.id, action.data);
          this.emitChange();
          break;
        case 'RemoveEntity':
          _.remove(Publics, {id: action.entity.id});
          this.emitChange();
          break;
        case 'AddPortal':
          Publics.push(action.portal);
          action.portal.itemOrder = Publics.length - 1;
          this.emitChange();
          break;
        case 'DeployPortalSuccess':
          const portal = this.findEntity(action.portal.id);

          if (portal) {
            portal.ready = true;
            this.emitChange();
          }
          break;
      }
    });
  }

  getData() {
    return Publics;
  }

  findEntity(id) {
    return _.find(Publics, {id: id});
  }

  findEntityIndex(id) {
    return _.findIndex(Publics, {id: id});
  }

  _insertPublicEndpoint(endpoint) {
    endpoint.itemOrder = Publics.length;
    Publics.push(endpoint);
  }
}

export default new Public;
