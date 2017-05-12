import React, {Component} from 'react';
import {Form} from 'formsy-react';
import {Title} from '../';
import {EntityProperty, EntityValidationErrors} from '../../../plugins/lunchbadger-ui/src';
import './FakeEntity.scss';

const validations = {
  isValid: false,
  data: {
    emptyValue: 'Some validation error message',
    filledValue: 'Short message',
    longLabel: 'Some validation error message, but now long enough to make it until the next row',
  },
}

const shortLabel = invalid => (
  <EntityProperty
    name={'emptyValue' + (invalid ? '' : 'Fake')}
    value=""
    title="Empty value"
    placeholder="Placeholder text"
    invalid={invalid}
  />
);

const actualValue = invalid => (
  <EntityProperty
    name={'filledValue' + (invalid ? '' : 'Fake')}
    value="Some value"
    title="Filled value"
    placeholder="Placeholder text"
    invalid={invalid}
  />
);

const validationError = invalid => (
  <EntityProperty
    name={'longLabel' + (invalid ? '' : 'Fake')}
    value="Some wrong value"
    title={'Long label to make it until the next row'}
    placeholder="Placeholder text"
    invalid={invalid}
  />
);

const onFieldClick = id => () => document.getElementById(id).focus();

const FakeEntity = ({children}) => (
  <Form>
    <div className="FakeEntity">
      <Title>View mode</Title>
      <div className="Entity">
        <div className="FakeEntity__content">
          {shortLabel()}
          {actualValue()}
          {validationError()}
        </div>
      </div>
    </div>
    <div className="FakeEntity">
      <Title>View mode + highlighted</Title>
      <div className="Entity highlighted">
        <div className="FakeEntity__content">
          {shortLabel()}
          {actualValue()}
          {validationError()}
        </div>
      </div>
    </div>
    <div className="FakeEntity">
      <Title>Edit mode</Title>
      <div className="Entity highlighted editable">
        <div className="FakeEntity__content">
          {shortLabel()}
          {actualValue()}
          {validationError()}
        </div>
      </div>
    </div>
    <div className="FakeEntity">
      <Title>Validation error</Title>
      <div className="Entity highlighted editable">
        <EntityValidationErrors
          validations={validations}
          onFieldClick={onFieldClick}
        />
        <div className="FakeEntity__content">
          {shortLabel(validations.data.emptyValue)}
          {actualValue(validations.data.filledValue)}
          {validationError(validations.data.longLabel)}
        </div>
      </div>
    </div>
  </Form>
);

export default FakeEntity;
