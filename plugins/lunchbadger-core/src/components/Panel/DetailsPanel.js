import React, {Component} from 'react';
import {connect} from 'react-redux';
import AppState from '../../stores/AppState';
import Panel from './Panel';
import panelKeys from '../../constants/panelKeys';

class DetailsPanel extends Component {
  constructor(props) {
    super(props);
    props.parent.storageKey = panelKeys.DETAILS_PANEL;
  }

  renderDetails() {
    const {currentElement} = this.props;
    if (currentElement) {
      const type = currentElement.constructor.name === 'Object' ? currentElement.type : currentElement.constructor.type;
      const panel = this.props.plugins.getDetailsPanel(type);
      if (panel.length) {
        const DetailsPanelComponent = panel[0].component;
        return <DetailsPanelComponent entity={currentElement}/>;
      }
    }
  }

  render() {
    return (
      <div className="panel__body">
        <div className="panel__title">
          Details
          {this.renderDetails()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentElement: state.core.appState.currentElement,
});

export default connect(mapStateToProps)(Panel(DetailsPanel));
