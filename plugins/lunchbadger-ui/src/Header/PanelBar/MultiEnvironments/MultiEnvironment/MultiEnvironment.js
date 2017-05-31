import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import Toggle from 'material-ui/Toggle';
import {IconSVG, ContextualInformationMessage} from '../../../../';
import './MultiEnvironment.scss';

class MultiEnvironment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balloonVisible: false,
    };
  }

  onClick = () => {
    const {onClick, index, selected} = this.props;
    if (selected) return;
    onClick(index);
  }

  toggleBalloon = balloonVisible => () => this.setState({balloonVisible});

  render() {
    const {name, delta, index, selected, icon, onClick, onToggleDelta} = this.props;
    const {balloonVisible} = this.state;
    const styles = {
      trackStyle: {
        height: 20,
        border: '1px solid rgba(255, 255, 255, 0.5)',
        backgroundColor: '#6d587d',
      },
      thumbOff: {
        width: 16,
        height: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        top: 2,
        left: 2,
      },
      iconStyle: {
        padding: 0,
      },
    };
    styles.thumbSwitched = {
      ...styles.thumbOff,
      backgroundColor: 'rgba(255, 255, 255, 1)',
      left: 'calc(100% - 2px)',
    };
    return (
      <div
        className={cs('MultiEnvironment', {['selected']: selected, ['development']: index === 0})}
        onClick={this.onClick}
      >
        <IconSVG className="MultiEnvironment__icon" svg={icon} />
        {index > 0 && name}
        {selected && index > 0 && (
          <div
            className="MultiEnvironment__switch"
            onMouseEnter={this.toggleBalloon(true)}
            onMouseLeave={this.toggleBalloon(false)}
            >
            <Toggle
              onToggle={onToggleDelta(index)}
              toggled={delta}
              thumbStyle={styles.thumbOff}
              trackStyle={styles.trackStyle}
              thumbSwitchedStyle={styles.thumbSwitched}
              trackSwitchedStyle={styles.trackStyle}
              iconStyle={styles.iconStyle}
            />
            {!delta && balloonVisible && (
              <ContextualInformationMessage>
                Show differences
              </ContextualInformationMessage>
            )}
          </div>
        )}
      </div>
    );
  }
}

MultiEnvironment.propTypes = {
  name: PropTypes.string,
  index: PropTypes.number,
  selected: PropTypes.bool,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  onToggleDelta: PropTypes.func,
};

export default MultiEnvironment;
