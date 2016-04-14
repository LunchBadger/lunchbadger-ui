import { dispatch } from '../../dispatcher/AppDispatcher';
import Product from '../../models/Product';

export default (name) => {
  dispatch('AddProduct', {
    product: Product.create({
      name: name || 'API'
    })
  });
};
