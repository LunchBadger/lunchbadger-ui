import Formsy from 'formsy-react';

Formsy.addValidationRule('isJSON', function (values, value) {
  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }

  return true;
});

Formsy.addValidationRule('inNotIn', function (values, value, array) {
  return array.indexOf(value) === -1;
});
