import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {inject, observer} from 'mobx-react';
import Panel from './Panel';
import panelKeys from '../../constants/panelKeys';

@inject('connectionsStore') @observer
class DetailsPanel extends Component {
  constructor(props) {
    super(props);
    props.parent.storageKey = panelKeys.DETAILS_PANEL;
  }

  renderDetails() {
    const {currentElement, panels, connectionsStore} = this.props;
    if (currentElement) {
      const {type} = currentElement.constructor;
      const DetailsPanelComponent = panels[type];
      if (DetailsPanelComponent) {
        return <DetailsPanelComponent
          entity={currentElement}
          sourceConnections={connectionsStore.getConnectionsForTarget(currentElement.id)}
          targetConnections={connectionsStore.getConnectionsForSource(currentElement.id)}
        />;
      }
    }
  }

  render() {
    return (
      <div className="panel__body details">
        <div className="panel__title">
          Details
          {this.renderDetails()}
        </div>
      </div>
    );
  }
}

const selector = createSelector(
  state => state.states.currentElement,
  state => state.states.currentlySelectedSubelements,
  state => state.plugins.panelDetailsElements,
  (currentElement, subelements, panels) => ({
    currentElement: subelements && subelements.length === 1 ? subelements[0] : currentElement,
    panels,
  }),
);

export default connect(selector)(Panel(DetailsPanel));
