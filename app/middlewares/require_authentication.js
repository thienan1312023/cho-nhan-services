const jwt = require('jsonwebtoken');
const User = require('../models/user');
var jwtDecode = require('jwt-decode');
require('dotenv').config();

module.exports = function (req, res, next) {
  var token = req.headers.authorization;
  var decodedValue = jwtDecode(token);
  if (decodedValue.userId) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        const error = new Error('Failed to authenticate');
        error.status = 401;
        next(error);
      } else {
        req.currentUserId = decodedValue.userId;
        return next();
      }
    });
  } else {
    req.user = undefined;
    const error = new Error('Failed to authenticate');
    error.status = 401;
    next(error);
  }
};


// module.exports = {
//   getAccountId: function (apiKey, cb) {
//     sql.connect(connectionString, (connection) => {
//       connection.query(query1, (result) => {
//         console.log(result1);
//         connection.query(query2, { ...result1 }, (result) => {
//           console.log(result2);
//           connection.query(query3, { ...result2 },
//             (result) => {
//               console.log(result3);
//             })
//         })
//       });
//     })
//   }
// };