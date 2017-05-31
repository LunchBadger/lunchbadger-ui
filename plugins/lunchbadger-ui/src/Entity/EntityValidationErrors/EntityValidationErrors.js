import React from 'react';
import PropTypes from 'prop-types';
import {SmoothCollapse} from '../../';
import './EntityValidationErrors.scss';

const EntityValidationErrors = ({validations, onFieldClick}) => (
  <SmoothCollapse expanded={!validations.isValid} heightTransition="800ms ease">
    <div className="EntityValidationErrors">
      The following items require your attention:
      <div className="EntityValidationErrors__fields">
        {validations.data && Object.keys(validations.data).map(key => (
          <div key={key}>
            <div
              className="EntityValidationErrors__fields__field"
              onClick={onFieldClick(key)}
            >
              {key.replace(/([A-Z])/g, " $1" )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </SmoothCollapse>
);

EntityValidationErrors.propTypes = {
  validations: PropTypes.object.isRequired,
  onFieldClick: PropTypes.func.isRequired,
}

export default EntityValidationErrors;
