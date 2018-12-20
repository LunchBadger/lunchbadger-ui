import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import './CopyOnHover.scss';

class CopyOnHover extends PureComponent {
  static propTypes = {
    copy: PropTypes.string,
    children: PropTypes.node,
  };

  render() {
    const {copy, children} = this.props;
    return (
      <CopyToClipboard text={copy}>
        <div className="CopyOnHover">
          {children}
          <div className="button">
            <i className="fa fa-copy iconCopy" />
          </div>
        </div>
      </CopyToClipboard>
    )
  }
}

export default CopyOnHover;
