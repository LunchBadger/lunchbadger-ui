import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {inject, observer} from 'mobx-react';
import cs from 'classnames';
import {setCurrentZoom, clearCurrentElement} from '../../reduxActions';
import {actions} from '../../reduxActions/actions';
import TwoOptionModal from '../Generics/Modal/TwoOptionModal';
import {RnD} from '../../../../lunchbadger-ui/src';
import './DetailsPanel.scss';

@inject('connectionsStore') @observer
class DetailsPanel extends Component {
  static type = 'DetailsPanel';

  constructor(props) {
    super(props);
    this.state = {
      showRemovingModal: false,
    };
  }

  handleClosePopup = () => this.props.dispatch(setCurrentZoom(undefined));

  handleTabChange = tab => () => {
    const {dispatch, zoom} = this.props;
    dispatch(setCurrentZoom({...zoom, tab}));
  };

  handleRemove = () => {
    const {currentElement, dispatch} = this.props;
    dispatch(setCurrentZoom(undefined));
    dispatch(currentElement.remove());
    dispatch(actions.removeEntity(currentElement));
    dispatch(clearCurrentElement());
  };

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

  renderDnD = () => {
    const {zoom, currentElement} = this.props;
    if (!(zoom && currentElement)) return <div />;
    const {tab} = zoom;
    const {name} = currentElement;
    const {type} = currentElement.constructor;
    const tabs = currentElement.tabs || [];
    const toolboxConfig = [{
      icon: 'iconTrash',
      onClick: () => this.setState({showRemovingModal: true}),
    }];
    if (tabs.length > 0) {
      toolboxConfig.push({
        icon: 'iconBasics',
        onClick: this.handleTabChange('general'),
        selected: tab === 'general',
      });
      tabs.map(({name, icon}) => toolboxConfig.push({
        icon,
        onClick: this.handleTabChange(name),
        selected: tab === name,
      }));
    }
    return (
      <RnD
        rect={zoom}
        name={name}
        type={type}
        onClose={this.handleClosePopup}
        toolbox={toolboxConfig}
      >
        {this.renderDetails()}
      </RnD>
    );
  };

  render() {
    const {zoom, currentElement} = this.props;
    return (
      <div className={cs('DetailsPanel', {visible: !!zoom && !!currentElement})}>
        {this.renderDnD()}
        {this.state.showRemovingModal && (
          <TwoOptionModal
            onClose={() => this.setState({showRemovingModal: false})}
            onSave={this.handleRemove}
            onCancel={() => this.setState({showRemovingModal: false})}
            title="Remove entity"
            confirmText="Remove"
            discardText="Cancel"
          >
            <span>
              Do you really want to remove that entity?
            </span>
          </TwoOptionModal>
        )}
      </div>
    );
  }
}

const selector = createSelector(
  state => state.states.currentElement,
  state => state.plugins.panelDetailsElements,
  state => state.states.zoom,
  (
    currentElement,
    panels,
    zoom,
  ) => ({
    currentElement,
    panels,
    zoom,
  }),
);

export default connect(selector)(DetailsPanel);
