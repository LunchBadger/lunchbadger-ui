import {notify} from 'react-notify-toast';

const {dispatch} = LBCore.dispatcher.AppDispatcher;

export default (from, to, newFrom, newTo, info) => {
  info.connection.setType('wip');

  setTimeout(() => {
    info.connection.removeType('wip');
    notify.show('Model successfully reattached to data source', 'success');
  }, 3000);

  dispatch('MoveConnection', {
    from,
    to,
    newFrom,
    newTo,
    info
  });
};
