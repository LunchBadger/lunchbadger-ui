import {notify} from 'react-notify-toast';
import {dispatch} from 'dispatcher/AppDispatcher';

export default (connectionInfo) => {
  if (!connectionInfo.connection.getParameter('existing')) {
    connectionInfo.connection.setType('wip');

    setTimeout(() => {
      connectionInfo.connection.removeType('wip');
      notify.show('Model successfully reattached to data source', 'success');
    }, 3000);
  }

  dispatch('MoveConnection', {
    from: connectionInfo.originalSourceId,
    to: connectionInfo.originalTargetId,
    newFrom: connectionInfo.newSourceId,
    newTo: connectionInfo.newTargetId,
    connectionInfo
  });
};
