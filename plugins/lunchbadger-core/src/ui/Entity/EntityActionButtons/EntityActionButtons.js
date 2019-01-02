import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {Button} from '../../';
import './EntityActionButtons.scss';

export default class EntityActionButtons extends PureComponent {
  static propTypes = {
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    zoom: PropTypes.bool,
    okDisabled: PropTypes.bool,
    okLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    submit: PropTypes.bool,
    skipCancel: PropTypes.bool,
  };

  static defaultProps = {
    onOk: undefined,
    zoom: false,
    okDisabled: false,
    okLabel: 'OK',
    cancelLabel: 'Cancel',
    submit: true,
    skipCancel: false,
  };

  render() {
    const {
      onCancel,
      onOk,
      okDisabled,
      zoom,
      okLabel,
      submit,
      skipCancel,
      cancelLabel,
    } = this.props;
    return (
      <div className={cs('EntityActionButtons', {zoom})}>
        <div className="EntityActionButtons__inner">
          <Button
            name="submit"
            type={submit ? 'submit' : undefined}
            disabled={okDisabled}
            onClick={onOk}
          >
            {okLabel}
          </Button>
          {!skipCancel && <Button name="cancel" onClick={onCancel}>{cancelLabel}</Button>}
          {!skipCancel && <Button name="close" onClick={onCancel}>Close</Button>}
        </div>
      </div>
    );
  }
}
