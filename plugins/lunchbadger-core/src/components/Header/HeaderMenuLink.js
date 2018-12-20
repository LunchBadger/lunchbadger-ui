import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import cs from 'classnames';
import {IconSVG, ContextualInformationMessage} from '../../ui';
import TwoOptionModal from '../Generics/Modal/TwoOptionModal';

class HeaderMenuLink extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmModal: false,
    };
  }

  handleClick = () => {
    const {dispatch, action, confirm} = this.props;
    if (confirm && !this.state.showConfirmModal) {
      this.setState({showConfirmModal: true});
      return;
    }
    dispatch(action);
  };

  render() {
    const {
      hidden,
      icon,
      svg,
      pressed,
      panel,
      name,
      confirm,
      url,
      tooltip,
      action,
    } = this.props;
    const linkClass = cs('header__menu__link', panel, name, {
      'header__menu__link--hidden': hidden,
      'header__menu__link--pressed': pressed,
    });
    const {showConfirmModal} = this.state;
    return (
      <li className="header__menu__element">
        {url && (
          <ContextualInformationMessage
            tooltip={tooltip}
            direction="bottom"
          >
            <a className={linkClass} href={url} target="_blank" onClick={action}>
              {icon && <i className={cs('fa', icon)} />}
              {!icon && url}
            </a>
          </ContextualInformationMessage>
        )}
        {!url && (
          <ContextualInformationMessage
            tooltip={tooltip}
            direction="bottom"
          >
            <span className={linkClass} onClick={this.handleClick}>
              {icon && <i className={cs('fa', icon)} />}
              {svg && <IconSVG className="header__menu__link__svg" svg={svg} />}
            </span>
          </ContextualInformationMessage>
        )}
        {confirm && showConfirmModal && (
          <TwoOptionModal
            onClose={() => this.setState({showConfirmModal: false})}
            onSave={this.handleClick}
            onCancel={() => this.setState({showConfirmModal: false})}
            title={confirm.title}
            confirmText={confirm.ok}
            discardText="Cancel"
          >
            {confirm.message}
          </TwoOptionModal>
        )}
      </li>
    );
  }
}

const selector = createSelector(
  (_, props) => props.panel || '',
  state => state.states.currentlyOpenedPanel,
  (panel, currentlyOpenedPanel) => ({pressed: panel === currentlyOpenedPanel}),
);

export default connect(selector)(HeaderMenuLink);
