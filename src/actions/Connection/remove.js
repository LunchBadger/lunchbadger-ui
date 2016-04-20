import { dispatch } from '../../dispatcher/AppDispatcher';

export default (from, to) => {
  dispatch('RemoveConnection', {
    from: from,
    to: to
  });
};
