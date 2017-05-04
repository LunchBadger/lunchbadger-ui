import React, {Component} from 'react';
import classNames from 'classnames';
import './Tool.scss';

const databases = [
  'Memory',
  'REST',
  'SOAP',
  'Redis',
  'MongoDB',
  'MySQL',
  'Ethereum',
  'Salesforce'
];

export default (ComposedComponent) => {
  return class Tool extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      const currentEditElement = this.props.currentEditElement ? this.props.currentEditElement.name : '';
      let isToolSelected = currentEditElement === ComposedComponent.name;
      if (ComposedComponent.name === 'Endpoint') {
        isToolSelected = currentEditElement.endsWith(ComposedComponent.name);
      }
      if (ComposedComponent.name === 'DataSource' && databases.includes(currentEditElement)) {
        isToolSelected = true;
      }
      return <div className={classNames({['tool--selected']: isToolSelected})}>
        <ComposedComponent {...this.props} {...this.state} />
      </div>;
    }
  }
}
