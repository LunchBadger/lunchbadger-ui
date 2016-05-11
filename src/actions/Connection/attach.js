import {notify} from 'react-notify-toast';
import {dispatch} from 'dispatcher/AppDispatcher';

export default (from, to, info) => {
  info.connection.setType('wip');

  setTimeout(() => {
    info.connection.removeType('wip');
    notify.show('Model successfully attached to data source', 'success');
  }, 3000);

  dispatch('AddConnection', {
    from,
    to,
    info
  });
};
