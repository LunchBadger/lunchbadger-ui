import {dispatch} from 'dispatcher/AppDispatcher';

export default (id, props) => {
  dispatch('UpdatePublicEndpoint', {
    id: id,
    data: {...props}
  });
};
