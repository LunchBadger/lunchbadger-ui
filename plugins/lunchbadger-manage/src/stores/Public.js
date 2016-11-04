import _ from 'lodash';

const ConnectionFactory = LunchBadgerCore.models.Connection;
const {BaseStore, Connection} = LunchBadgerCore.stores;
const {register} = LunchBadgerCore.dispatcher.AppDispatcher;

let Publics = [];

class Public extends BaseStore {
  constructor() {
    super(2);
    register((action) => {
      this.handleBaseActions('Public', ['PublicEndpoint', 'API', 'Portal'], action);

      switch (action.type) {
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
        case 'DeployPortalSuccess':
          const portal = this.findEntity(action.portal.id);

          if (portal) {
            portal.ready = true;
            this.emitChange();
          }
          break;
        case 'BundlePortal':
          Publics.splice(this.findEntityIndex(action.api.id), 1);
          action.portal.addAPI(action.api);
          this.emitChange();
          break;
        case 'UnbundlePortal':
          this._insertAPI(action.api);
          action.portal.removeAPI(action.api);
          this.emitChange();
          break;
        case 'RebundlePortal':
          action.fromPortal.removeAPI(action.api);
          action.toPortal.addAPI(action.api);
          this.emitChange();
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

  _insertAPI(api) {
    api.itemOrder = Publics.length - 1;
    Publics.push(api);
  }

  _insertPublicEndpoint(endpoint) {
    endpoint.itemOrder = Publics.length - 1;
    Publics.push(endpoint);
  }
}

export default new Public;
