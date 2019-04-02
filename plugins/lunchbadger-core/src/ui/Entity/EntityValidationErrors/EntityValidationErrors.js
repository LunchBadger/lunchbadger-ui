import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {SmoothCollapse, scrollToElement} from '../../';
import './EntityValidationErrors.scss';

const formatKey = key => key
  .replace(/([A-Z])/g, ' $1')
  .replace(/\[/g, '^')
  .replace(/\]/g, '')
  .replace(/Lunch Badger\^/g, '');

class EntityValidationErrors extends Component {
  static propTypes = {
    validations: PropTypes.object.isRequired,
    basic: PropTypes.bool,
  };

  static defaultProps = {
    basic: false,
  };

  handleFieldClick = field => ({target}) => {
    const closestCanvasElement = target.closest('form');
    const id = field.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
    const closestInput = closestCanvasElement && closestCanvasElement.getElementById(id);
    closestInput && scrollToElement(closestInput);
  }

  render() {
    const {validations, basic} = this.props;
    return (
      <SmoothCollapse expanded={!validations.isValid} heightTransition="800ms ease">
        <div
          ref={r => this.element = r}
          className={cs('EntityValidationErrors', {basic})}
        >
          The following items require your attention:
          <div className="EntityValidationErrors__fields">
            {validations.data && Object.keys(validations.data).map(key => {
              const validationItem = validations.data[key];
              const custom = typeof validationItem === 'object';
              const path = custom ? validationItem.customPath : formatKey(key);
              const message = custom ? validationItem.message : validationItem;
              return (
                <div key={key}>
                  <div
                    className={cs(
                      'EntityValidationErrors__fields__field',
                      `validationError__${key}`,
                      {custom}
                    )}
                    onClick={this.handleFieldClick(key)}
                  >
                    <span>
                      {path.split('^').map((item, idx) => (
                        <span key={idx} className="EntityValidationErrors__fields__item">
                          {item}
                        </span>
                      ))}
                    </span>
                    {basic && (
                      <span className="basic">
                        {' '} - {message}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SmoothCollapse>
    );
  }
}

export default EntityValidationErrors;
