import {dispatch} from '../../dispatcher/AppDispatcher';

export default (id, props) => {
  dispatch('UpdateProduct', {
    id: id,
    data: {...props}
  });
};
