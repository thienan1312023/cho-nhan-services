var express = require('express');
var router = express.Router();
router.use('/catalog', require('./things/catalog'));
router.use('/category', require('./things/category'));
router.use('/gift', require('./things/gift'));
router.use('/user', require('./user/user'));
module.exports = router;