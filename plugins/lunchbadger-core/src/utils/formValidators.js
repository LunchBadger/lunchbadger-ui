import Formsy from '../../../lunchbadger-ui/src/utils/Formsy/main';

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

Formsy.addValidationRule('isValidEntityName', function(_values, value) {
  return value.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/) !== null;
});
