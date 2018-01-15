import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import classNames from 'classnames';
import './PanelContainer.scss';

class PanelContainer extends Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    panels: PropTypes.array.isRequired,
  };

  render() {
    const {disabled, panels} = this.props;
    const panelContainerClass = classNames({
      'panel-container': true,
      'panel-container--disabled': disabled,
    });
    return (
      <div className={panelContainerClass}>
        {panels.map((PanelComponent, idx) => <PanelComponent key={idx} />)}
      </div>
    );
  }
}

const selector = createSelector(
  state => !!state.states.currentEditElement,
  state => state.plugins.panels,
  (disabled, panels) => ({disabled, panels}),
);

export default connect(selector)(PanelContainer);
