import messages from './messages';

export default (fields, model, invalid) => {
  const {fieldCannotBeEmpty} = messages;
  fields.forEach((field) => {
    if (model[field] === '') invalid[field] = fieldCannotBeEmpty;
  });
};
