import React, {PureComponent} from 'react';
import FlexibleProperties from './FlexibleProperties';

export default class Mysql extends PureComponent {
  render() {
    return <FlexibleProperties {...this.props} />;
  }
}
