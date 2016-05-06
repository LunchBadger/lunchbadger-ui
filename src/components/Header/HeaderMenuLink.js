import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

const togglePanel = LunchBadgerCore.actions.togglePanel;
const AppState = LunchBadgerCore.stores.AppState;

export default class HeaderMenuLink extends Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    togglePanel: PropTypes.string.isRequired
  };
  
  constructor(props) {
    super(props);
    
    this.state = {
      pressed: false
    };
    
    this.appStateUpdate = () => {
      const currentPanel = AppState.getStateKey('currentlyOpenedPanel');
      
      if (currentPanel === props.togglePanel) {
        this.setState({pressed: true});
      } else {
        this.setState({pressed: false});
      }
    };
  }

  componentWillMount() {
    AppState.addChangeListener(this.appStateUpdate);
  }

  componentWillUnmount() {
    AppState.removeChangeListener(this.appStateUpdate);
  }
  
  render() {
    const linkClass = classNames({
      'header__menu__link': true,
      'header__menu__link--pressed': this.state.pressed
    });
    
    return (
      <a href="#" className={linkClass} onClick={() => togglePanel(this.props.togglePanel)}>
        <i className={`fa ${this.props.icon}`}/>
      </a>
    );
  }
}
