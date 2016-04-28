import {dispatch} from 'dispatcher/AppDispatcher';

export default (from, to, newFrom, newTo, info) => {
  info.connection.setType('wip');

  setTimeout(() => {
    info.connection.removeType('wip');
  }, 3000);

  dispatch('MoveConnection', {
    from,
    to,
    newFrom,
    newTo,
    info
  });
};
