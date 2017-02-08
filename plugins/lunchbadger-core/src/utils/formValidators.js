import Formsy from 'formsy-react';

Formsy.addValidationRule('isJSON', function (_values, value) {
  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }

  return true;
});

Formsy.addValidationRule('isNotIn', function (_values, value, array) {
  return array.indexOf(value) === -1;
});
