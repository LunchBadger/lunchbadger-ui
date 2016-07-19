import {notify} from 'react-notify-toast';
import {dispatch} from 'dispatcher/AppDispatcher';

export default (connectionInfo) => {
  if (!connectionInfo.connection.getParameter('existing')) {
    connectionInfo.connection.setType('wip');

    setTimeout(() => {
      connectionInfo.connection.removeType('wip');
      notify.show('Model successfully attached to data source', 'success');
    }, 3000);
  }

  dispatch('AddConnection', {
    from: connectionInfo.sourceId,
    to: connectionInfo.targetId,
    info: connectionInfo
  });
};
