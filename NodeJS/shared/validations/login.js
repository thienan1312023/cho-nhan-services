const Validator = require('validator');
const { isEmpty } = require('../../utils');

module.exports = function validateInput(data) {
  let errors = {};

  if (Validator.isEmpty(data.userEmail || '')) {
    errors.username = 'User email is required';
  }

  if (Validator.isEmpty(data.password || '')) {
    errors.password = 'Password is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
