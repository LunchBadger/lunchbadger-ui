import React, {Component} from 'react';
import Panel from './Panel';
import panelKeys from 'constants/panelKeys';

class DetailsPanel extends Component {
  constructor(props) {
    super(props);
    
    props.parent.storageKey = panelKeys.DETAILS_PANEL;
  }

  render() {
    return (
      <div className="panel__body">
        <div className="panel__title">
          Details
        </div>
      </div>
    );
  }
}

export default Panel(DetailsPanel);
