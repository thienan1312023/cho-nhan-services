const Validator = require('validator');
const { isEmpty } = require('../../utils');

module.exports = function validateInput(data) {
  let errors = {};
  //let typeOfContactIndentity = "";
  if(data.contactIdentity){
    if(data.contactIdentity.contactType === "email"){
      if (Validator.isEmpty(data.contactIdentity.content || '')) {
        errors.userEmail = 'Email is required';
      }
      if (!Validator.isEmail(data.contactIdentity.content || '')) {
        errors.userEmail = 'Format of email is wrong';
      }
      // else{
      //   typeOfContactIndentity = "email";
      // }
    }
    if(data.contactIdentity.contactType === "phone"){
      var isNumberOnly = /^\d+$/.test(data.contactIdentity.content);
      if(!isNumberOnly && data.contactIdentity.content.length != 10){
        errors.userPhoneNumber = "Format of phone number is wrong";
      }
      // if(isNumberOnly == true){
      //   typeOfContactIndentity = "phone";
      // }
    }

    if(data.contactIdentity.contactType !== "email" && data.contactIdentity.contactType !== "phone"){
      error.userEmail.contactIdentity = "Format of contact identity type is not define";
    }
  
  }else{
    errors.contactIdentity = "Format of contact identity is wrong format";
  }
  if (Validator.isEmpty(data.password || '')) {
    errors.password = 'Password is required';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 64 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  // if (Validator.isEmpty(data.passwordConfirmation || '')) {
  //   errors.passwordConfirmation = 'Password confirmation is required';
  // }
  // if (!Validator.equals(data.password, data.passwordConfirmation)) {
  //   errors.passwordConfirmation = 'Passwords must match';
  // }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

