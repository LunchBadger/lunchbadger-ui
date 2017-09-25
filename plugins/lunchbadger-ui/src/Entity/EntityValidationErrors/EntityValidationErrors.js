import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {SmoothCollapse} from '../../';
import './EntityValidationErrors.scss';

class EntityValidationErrors extends Component {
  static propTypes = {
    validations: PropTypes.object.isRequired,
    onFieldClick: PropTypes.func.isRequired,
    basic: PropTypes.bool,
  };

  static defaultProps = {
    onFieldClick: () => {},
    basic: false,
  };

  render() {
    const {validations, onFieldClick, basic} = this.props;
    return (
      <SmoothCollapse expanded={!validations.isValid} heightTransition="800ms ease">
        <div
          ref={r => this.element = r}
          className={cs('EntityValidationErrors', {basic})}
        >
          The following items require your attention:
          <div className="EntityValidationErrors__fields">
            {validations.data && Object.keys(validations.data).map(key => (
              <div key={key}>
                <div
                  className="EntityValidationErrors__fields__field"
                  onClick={onFieldClick(key)}
                >
                  {key.replace(/([A-Z])/g, ' $1')}
                  {basic && (
                    <span>
                      {' '} - {validations.data[key]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SmoothCollapse>
    );
  }
}

export default EntityValidationErrors;
