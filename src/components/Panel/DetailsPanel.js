import React, {Component} from 'react';
import AppState from 'stores/AppState';
import Panel from './Panel';
import panelKeys from 'constants/panelKeys';

class DetailsPanel extends Component {
  constructor(props) {
    super(props);

    props.parent.storageKey = panelKeys.DETAILS_PANEL;

    this.state = {
      element: null
    };

    this.appStateUpdate = () => {
      this.setState({element: AppState.getStateKey('currentElement')});
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.opened && !this.props.opened) {
      AppState.addChangeListener(this.appStateUpdate);

      this.setState({element: AppState.getStateKey('currentElement')});
    }

    if (!nextProps.opened && this.props.opened) {
      AppState.removeChangeListener(this.appStateUpdate);
    }
  }

  renderDetails() {
    if (this.state.element) {
      const panel = this.props.plugins.getDetailsPanel(this.state.element.constructor.type);

      if (panel.length) {
        const DetailsPanelComponent = panel[0].component;

        return <DetailsPanelComponent entity={this.state.element}/>;
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
