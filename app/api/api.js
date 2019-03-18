var express = require('express');
var router = express.Router();
const requireAuth = require('../middlewares/require_authentication');

router.use('/catalog', require('./things/catalog'));
router.use('/category', require('./things/category'));
router.use('/post', require('./things/post'));
router.use('/user', require('./user/user'));
router.use('/address', require('./things/address'));
module.exports = router;