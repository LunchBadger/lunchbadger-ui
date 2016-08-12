/*eslint no-console:0 */
import {notify} from 'react-notify-toast';

console.info('Pre-fetching projects data...');

const ProjectService = LunchBadgerCore.services.ProjectService;
const projectData = ProjectService.get('roman', 'dev');
const waitForStores = LunchBadgerCore.utils.waitForStores;

let storesList = [];

if (LunchBadgerManage) {
  storesList.push(
    LunchBadgerManage.stores.Private,
    LunchBadgerManage.stores.Gateway,
    LunchBadgerManage.stores.Public
  );
}

if (LunchBadgerCompose) {
  storesList.push(
    LunchBadgerCompose.stores.Backend
  );
}

projectData.then((res) => {
  const data = res.body;
  const rev = res.response.headers['etag'];
  console.log(rev);

  LunchBadgerCore.actions.Stores.AppState.setProjectRevision(rev);

  waitForStores(storesList, () => {
    // attach connections ;-)
    data.connections.forEach((connection) => {
      if (document.getElementById(`port_out_${connection.fromId}`) && document.getElementById(`port_in_${connection.toId}`)) {
        setTimeout(() => LunchBadgerCore.utils.paper.connect({
          source: document.getElementById(`port_out_${connection.fromId}`).querySelector('.port__anchor'),
          target: document.getElementById(`port_in_${connection.toId}`).querySelector('.port__anchor'),
          parameters: {
            existing: 1
          }
        }));
      }
    });

    setTimeout(() => {
      LunchBadgerCore.actions.Stores.AppState.initialize(data.states);
    });

    notify.show('All data has been synced with API', 'success');
  });

  if (LunchBadgerManage) {
    LunchBadgerManage.actions.Stores.Public.initialize(data);
    LunchBadgerManage.actions.Stores.Private.initialize(data);
    LunchBadgerManage.actions.Stores.Gateway.initialize(data);
  }

  if (LunchBadgerCompose) {
    LunchBadgerCompose.actions.Stores.Private.initialize(data);
    LunchBadgerCompose.actions.Stores.Backend.initialize(data);
  }

  if (LunchBadgerMonetize) {
    LunchBadgerMonetize.actions.Stores.Public.initialize(data);
  }
}).catch(() => {
  notify.show('Failed to sync data with API, working offline! Try to refresh page...', 'error');
});
