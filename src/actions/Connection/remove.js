import { dispatch } from '../../dispatcher/AppDispatcher';

export default (from, to) => {
  dispatch('RemoveConnection', {
    fromId: from,
    toId: to
  });
};
