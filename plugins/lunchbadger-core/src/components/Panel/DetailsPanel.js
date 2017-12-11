import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {inject, observer} from 'mobx-react';
import {setCurrentZoom} from '../../reduxActions';
import {RnD} from '../../../../lunchbadger-ui/src';

@inject('connectionsStore') @observer
class DetailsPanel extends Component {
  static type = 'DetailsPanel';

  renderDetails() {
    const {currentElement, panels, connectionsStore, zoom} = this.props;
    if (currentElement) {
      const {type} = currentElement.constructor;
      const DetailsPanelComponent = panels[type];
      if (DetailsPanelComponent) {
        return (
          <div className="panel panel__body details highlighted editable">
            <DetailsPanelComponent
              entity={currentElement}
              sourceConnections={connectionsStore.getConnectionsForTarget(currentElement.id)}
              targetConnections={connectionsStore.getConnectionsForSource(currentElement.id)}
              rect={zoom}
            />
          </div>
        );
      }
    }
  }

  handleClosePopup = () => this.props.dispatch(setCurrentZoom(undefined));

  render() {
    const {zoom, currentElement} = this.props;
    if (!zoom) return null;
    const {name} = currentElement;
    const type = currentElement.constructor.type;
    return (
      <RnD
        rect={zoom}
        name={name}
        type={type}
        onClose={this.handleClosePopup}
      >
        {this.renderDetails()}
      </RnD>
    );
  }
}

const selector = createSelector(
  state => state.states.currentElement,
  state => state.states.currentlySelectedSubelements,
  state => state.plugins.panelDetailsElements,
  state => state.states.zoom,
  (currentElement, subelements, panels, zoom) => ({
    currentElement: subelements && subelements.length === 1 ? subelements[0] : currentElement,
    panels,
    zoom,
  }),
);

export default connect(selector)(DetailsPanel);
