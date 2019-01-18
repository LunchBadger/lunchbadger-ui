import React, {PureComponent} from 'react';
import FlexibleProperties from './FlexibleProperties';

export default class Storage extends PureComponent {
  render() {
    return <FlexibleProperties {...this.props} />;
  }
}
