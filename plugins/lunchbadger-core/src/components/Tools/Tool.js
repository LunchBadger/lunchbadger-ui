import React, {Component} from 'react';
import './Tool.scss';

export default (ComposedComponent) => {
  return class Tool extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      return <ComposedComponent {...this.props} {...this.state} />;
    }
  }
}
