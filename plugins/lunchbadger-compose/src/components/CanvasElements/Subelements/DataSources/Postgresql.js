import React, {PureComponent} from 'react';
import FlexibleProperties from './FlexibleProperties';

export default class Postgresql extends PureComponent {
  render() {
    return <FlexibleProperties {...this.props} />;
  }
}
