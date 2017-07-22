import React, {Component} from 'react';
import AppState from '../../stores/AppState';
import Panel from './Panel';
import panelKeys from '../../constants/panelKeys';

class DetailsPanel extends Component {
  constructor(props) {
    super(props);

    props.parent.storageKey = panelKeys.DETAILS_PANEL;

    this.state = {
      element: null
    };

    this.appStateUpdate = () => {
      this.setState({element: this.getSelectedElement()});
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.opened && !this.props.opened) {
      AppState.addChangeListener(this.appStateUpdate);

      this.setState({element: this.getSelectedElement()});
    }

    if (!nextProps.opened && this.props.opened) {
      AppState.removeChangeListener(this.appStateUpdate);
    }
  }

  getSelectedElement = () => {
    const subelements = AppState.getStateKey('currentlySelectedSubelements');
    if (subelements && subelements.length === 1) {
      return subelements[0];
    }
    return AppState.getStateKey('currentElement');
  }

  renderDetails() {
    const {element} = this.state;

    if (element) {
      const type = element.constructor.name === 'Object' ? element.type : element.constructor.type;
      const panel = this.props.plugins.getDetailsPanel(type);

      if (panel.length) {
        const DetailsPanelComponent = panel[0].component;

        return <DetailsPanelComponent entity={element}/>;
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

export default Panel(DetailsPanel);
