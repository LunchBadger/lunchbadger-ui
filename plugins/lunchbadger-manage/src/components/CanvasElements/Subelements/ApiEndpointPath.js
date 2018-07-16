import React, {PureComponent} from 'react';
import {EntityProperty} from '../../../../../lunchbadger-ui/src';

export default class ApiEndpointPath extends PureComponent {

  handleRemovePath = () => {
    const {idx, onRemovePath} = this.props;
    onRemovePath(idx);
  };

  handlePathTab = () => {
    const {idx, onPathTab} = this.props;
    onPathTab(idx);
  };

  handlePathChange = ({target: {value}}) => {
    const {idx, onPathChange} = this.props;
    onPathChange(idx, value);
  };

  render() {
    const {name, path, idx} = this.props;
    return (
      <EntityProperty
        key={idx}
        placeholder="Enter path here"
        name={name}
        value={path}
        onDelete={this.handleRemovePath}
        onTab={this.handlePathTab}
        onBlur={this.handlePathChange}
      />
    );
  }
}
