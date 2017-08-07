import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import AppState from '../../stores/AppState';
import Panel from './Panel';
import panelKeys from '../../constants/panelKeys';

class DetailsPanel extends Component {
  constructor(props) {
    super(props);
    props.parent.storageKey = panelKeys.DETAILS_PANEL;
  }

  renderDetails() {
    const {currentElement, panels} = this.props;
    if (currentElement) {
      const {type} = currentElement.constructor;
      const DetailsPanelComponent = panels[type];
      if (DetailsPanelComponent) {
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

const selector = createSelector(
  state => state.states.currentElement,
  state => state.plugins.panelDetailsElements,
  (currentElement, panels) => ({currentElement, panels}),
);

export default connect(selector)(Panel(DetailsPanel));
