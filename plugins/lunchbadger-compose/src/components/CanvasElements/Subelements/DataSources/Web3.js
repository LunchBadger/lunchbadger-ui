import React, {PureComponent} from 'react';
import FlexibleProperties from './FlexibleProperties';

export default class Web3 extends PureComponent {
  render() {
    return <FlexibleProperties {...this.props} />;
  }
}
