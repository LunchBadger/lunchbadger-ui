import React, {Component, PropTypes} from 'react';

export default (ComposedComponent) => {
  return class BaseDetails extends Component {
    static propTypes = {
      entity: PropTypes.object.isRequired
    }

    constructor(props) {
      super(props);
    }

    render() {
      return (
        <ComposedComponent parent={this} {...this.props} {...this.state}/>
      )
    }
  }
}
