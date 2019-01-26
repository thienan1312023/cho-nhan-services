const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: 60 * 60 });
};