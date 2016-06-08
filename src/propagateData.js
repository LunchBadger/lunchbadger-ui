/*eslint no-console:0 */
import {notify} from 'react-notify-toast';

console.info('Pre-fetching projects data...');

const ProjectService = LunchBadgerCore.services.ProjectService;
const projectData = ProjectService.getAll();
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

projectData.then((response) => {
  if (Array.isArray(response.body)) {
    // right now, just load first available project

    const data = response.body[0];

    LunchBadgerCore.actions.Stores.AppState.setProject(data.id, data.name);

    waitForStores(storesList, () => {
      // attach connections ;-)
      data.connections.forEach((connection) => {
        setTimeout(() => LunchBadgerCore.utils.paper.connect({
          source: document.getElementById(`port_out_${connection.fromId}`),
          target: document.getElementById(`port_in_${connection.toId}`)
        }));
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
  }
}).catch(() => {
  notify.show('Failed to sync data with API, working offline! Try to refresh page...', 'error');
});
