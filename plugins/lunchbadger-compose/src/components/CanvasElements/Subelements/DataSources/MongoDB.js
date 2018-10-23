import React, {PureComponent} from 'react';
import FlexibleProperties from './FlexibleProperties';

export default class Mongodb extends PureComponent {
  render() {
    return <FlexibleProperties {...this.props} />;
  }
}
