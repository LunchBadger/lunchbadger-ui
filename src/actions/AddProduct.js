import { dispatch } from '../dispatcher/AppDispatcher';
import Product from '../models/Product';

export default () => {
  dispatch('AddProduct', {
    product: Product.create({
      name: 'Product'
    })
  });
};
