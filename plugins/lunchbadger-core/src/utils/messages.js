const getPrefixedName = (name) => `${name[0] === 'a' ? 'An' : 'A'} ${name}`;

export default {
  fieldCannotBeEmpty: 'This field cannot be empty',
  duplicatedEntityName: type => `${getPrefixedName(type.toLowerCase())} with that name already exists`,
};
