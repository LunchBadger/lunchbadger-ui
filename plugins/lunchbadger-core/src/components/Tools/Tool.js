import React, {Component} from 'react';
import classNames from 'classnames';
import './Tool.scss';

export default (ComposedComponent) => {
  return class Tool extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      const currentEditElement = this.props.currentEditElement ? this.props.currentEditElement.__proto__.constructor.name : '';
      let isToolSelected = currentEditElement === ComposedComponent.name;
      if (ComposedComponent.name === 'Endpoint') {
        isToolSelected = currentEditElement.endsWith(ComposedComponent.name);
      }
      return <div className={classNames({['tool--selected']: isToolSelected})}>
        <ComposedComponent {...this.props} {...this.state} />
      </div>;
    }
  }
}
