var express = require('express');
var router = express.Router();
router.use('/catalog', require('./things/catalog'));
router.use('/category', require('./things/category'));
router.use('/post', require('./things/post'));
router.use('/user', require('./user/user'));
module.exports = router;