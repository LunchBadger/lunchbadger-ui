import {dispatch} from 'dispatcher/AppDispatcher';

export default (from, to, info) => {
  info.connection.setType('wip');

  setTimeout(() => {
    info.connection.removeType('wip');
  }, 3000);

  dispatch('AddConnection', {
    from,
    to,
    info
  });
};
