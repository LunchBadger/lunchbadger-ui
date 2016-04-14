import React, {Component} from 'react';
import './Tool.scss';
import AddProduct from 'actions/Product/add';

export default class Product extends Component {
  render() {
    return (
      <div className="product tool" onClick={() => AddProduct('API')}>
        <i className="tool__icon fa fa-archive"></i>
        <span className="tool__tooltip">API</span>
      </div>
  );
  }
}
