import React, {PureComponent} from 'react';
import {ContextualInformationMessage} from '../';
import {docsLinks} from '../utils';
import './DocsLink.scss';

export default class DocsLink extends PureComponent {
  render() {
    const {item} = this.props;
    return (
      <ContextualInformationMessage
        tooltip="Documentation reference"
        direction="bottom"
      >
        <a
          className="DocsLink"
          href={docsLinks[item]} target="_blank"
          onClick={e => e.stopPropagation()}
        >
          <i className="fa fa-question" />
        </a>
      </ContextualInformationMessage>
    );
  }
}
