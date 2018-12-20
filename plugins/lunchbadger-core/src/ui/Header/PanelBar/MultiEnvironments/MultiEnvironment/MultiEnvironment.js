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
      name: props.name,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.edit !== this.props.edit && this.props.edit) {
      this.nameRef.select();
    }
  }

  onClick = () => {
    const {onClick, index, selected} = this.props;
    if (selected) return;
    onClick(index);
  }

  handleChangeName = event => this.setState({name: event.target.value});

  handleKeyDown = (event) => {
    if ((event.keyCode === 13 || event.which === 13) && event.target.value.trim().length > 0) {
      const {onUpdateName, index} = this.props;
      onUpdateName(index, event.target.value.trim());
    }
  }

  toggleNameEdit = edit => () => {
    const {onToggleNameEdit, index} = this.props;
    onToggleNameEdit(index, edit);
    if (!edit) {
      this.setState({name: this.props.name});
    }
  }

  render() {
    const {delta, index, selected, icon, onToggleDelta, edit} = this.props;
    const {name} = this.state;
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
        className={cs('MultiEnvironment', {selected, ['development']: index === 0, edit})}
        onClick={this.onClick}
      >
        <IconSVG className="MultiEnvironment__icon" svg={icon} />
        {index > 0 && (
          <span
            className="MultiEnvironment__input"
            onDoubleClick={this.toggleNameEdit(true)}
          >
            {!edit && name}
            <input
              ref={(r) => {this.nameRef = r;}}
              value={name}
              onChange={this.handleChangeName}
              onKeyDown={this.handleKeyDown}
              onBlur={this.toggleNameEdit(false)}
            />
          </span>
        )}
        {selected && index > 0 && (
          <ContextualInformationMessage
            direction="bottom"
            tooltip={`${delta ? 'Hide' : 'Show'} differences`}
          >
            <div className="MultiEnvironment__switch">
              <Toggle
                onToggle={onToggleDelta(index)}
                toggled={delta}
                thumbStyle={styles.thumbOff}
                trackStyle={styles.trackStyle}
                thumbSwitchedStyle={styles.thumbSwitched}
                trackSwitchedStyle={styles.trackStyle}
                iconStyle={styles.iconStyle}
              />
            </div>
          </ContextualInformationMessage>
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
