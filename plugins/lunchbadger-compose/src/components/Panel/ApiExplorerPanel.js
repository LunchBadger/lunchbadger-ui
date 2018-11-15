import React, {Component} from 'react';
import Config from '../../../../../src/config';
import './ApiExplorerPanel.scss';

const Panel = LunchBadgerCore.components.Panel;

class ApiExplorerPanel extends Component {
  static type = 'ApiExplorerPanel';

  constructor(props) {
    super(props);
    props.parent.storageKey = 'API_EXPLORER_PANEL';
    this.apiExplorerUrl = Config.get('apiExplorerUrl');
  }

  render() {
    return (
      <div className="panel__body ApiExplorerPanel">
        <iframe src={this.apiExplorerUrl} />
      </div>
    );
  }
}

export default Panel(ApiExplorerPanel);
