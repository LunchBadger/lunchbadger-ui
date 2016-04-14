import { dispatch } from '../../dispatcher/AppDispatcher';
import Product from '../../models/API';

export default () => {
  dispatch('AddAPI', {
    product: Product.create({
      name: 'API'
    })
  });
};
