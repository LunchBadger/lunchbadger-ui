import React, {PureComponent} from 'react';
import FlexibleProperties from './FlexibleProperties';

export default class Redis extends PureComponent {
  render() {
    return <FlexibleProperties {...this.props} />;
  }
}
