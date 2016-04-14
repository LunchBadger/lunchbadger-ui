import React, {Component} from 'react';
import './Tool.scss';
import AddProduct from 'actions/API/add';

export default class Product extends Component {
  render() {
    return (
      <div className="product tool" onClick={() => AddProduct()}>
        <i className="tool__icon fa fa-archive"></i>
        <span className="tool__tooltip">API</span>
      </div>
  );
  }
}
